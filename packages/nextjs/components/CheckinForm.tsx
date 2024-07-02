"use client";

import React, { Dispatch, SyntheticEvent, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/custom-datepicker.css";
import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAccount } from "wagmi";
import { ClockIcon, DocumentTextIcon, MapPinIcon } from "@heroicons/react/24/outline";
import easConfig from "~~/EAS.config";
import { EASContext } from "~~/components/EasContextProvider";

// To add DaisyUI styles

// import Link from "next/link";

const CheckinForm = ({ latLng = [0, 0], setIsTxLoading }: { latLng: number[]; setIsTxLoading: Dispatch<boolean> }) => {
  // NextJS redirect
  const { push } = useRouter();

  const { address: connectedAddress } = useAccount(); //get address from wagmi
  const [formValues, setFormValues] = useState({
    coordinateInputX: latLng[0], // to be picked up by prop
    coordinateInputY: latLng[1], // to be picked up by prop
    timestamp: new Date(),
    data: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      handleChange({ target: { name: "timestamp", value: date } });
    } else {
      setSelectedDate(null);
    }
  };

  // Use EAS SDK
  const { eas, isReady } = useContext(EASContext);
  // const [attestation, setAttestation] = useState<Attestation>();

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder("string[] coordinates,address subject,uint256 timestamp,bytes32 message");

  const schemaUID = easConfig.SCHEMA_UID_SEPOLIA; // TODO: read according to chainId

  const handleChange = (event: { preventDefault?: () => void; target: { name: string; value: any } }) => {
    if (event.preventDefault) event.preventDefault();
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  // Set attestation from EAS api
  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setIsTxLoading(true);

    if (!isReady) return; // notify user

    const encodedData = schemaEncoder.encodeData([
      {
        name: "coordinates",
        value: [formValues.coordinateInputX.toString(), formValues.coordinateInputY.toString()],
        type: "string[]",
      },
      { name: "subject", value: connectedAddress || "0xA332573D0520ee4653a878FA23774726811ae31A", type: "address" },
      {
        name: "timestamp",
        value: Math.floor(formValues.timestamp.getTime() / 1000), // here we convert to nowInSeconds
        type: "uint256",
      },
      { name: "message", value: formValues.data, type: "bytes32" },
    ]);

    console.log("value", Math.floor(formValues.timestamp.getTime() / 1000));

    eas
      .attest({
        schema: schemaUID,
        data: {
          recipient: easConfig.EAS_CONTRACT_SEPOLIA, // To be read by chainId
          expirationTime: 0n,
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      })
      .then(tx => {
        return tx.wait();
      })
      .then(newAttestationUID => {
        console.log("[🧪 DEBUG](newAttestationUID):", newAttestationUID);
        setIsTxLoading(false);
        push(`/attestation/uid/${newAttestationUID}`);
      })
      .catch(err => {
        console.log("[🧪 DEBUG](err):", err);
      });
  }

  console.log("TIMESTAMP!", formValues.timestamp);

  return (
    <div className="flex items-center flex-col w-full flex-grow">
      <div className="flex-grow center w-full">
        <form onSubmit={handleSubmit} className="card m-5 flex flex-col gap-4">
          <label className="flex flex-row items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary flex-shrink-0 flex-grow-0" style={{ flexBasis: "auto" }} />
            <input
              type="number"
              name="coordinateInputX"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={latLng[0]}
              onChange={handleChange}
            />
            <input
              type="number"
              name="coordinateInputY"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              value={latLng[1]}
              onChange={handleChange}
            />
          </label>
          <label className="flex flex-row items-center gap-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              timeIntervals={1}
              dateFormat="Pp"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
            />
          </label>
          <label className="flex flex-row items-center gap-2 w-full">
            <DocumentTextIcon className="h-5 w-5 text-primary" />
            <input
              type="text"
              name="data"
              value={formValues.data}
              placeholder="Memo"
              className="input input-bordered w-full bg-base-200 border-indigo-500 text-black"
              onChange={handleChange}
            />
          </label>
          <input type="submit" value="Record Log Entry" className="input btn btn-primary bg-primary" />
        </form>
      </div>
    </div>
  );
};

export default CheckinForm;
