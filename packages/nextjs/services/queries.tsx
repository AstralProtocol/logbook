import { gql } from '@apollo/client';

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
      description
      photo
    }
  }
`;
export const GET_ATTESTATIONS = gql`
  query getAttestations($schemaId: String) {
    attestations(where: { schema: { is: { id: { equals: $schemaId } } } }) {
      id
      decodedDataJson
      attester
    }
  }
`;
export const GET_ATTESTATION = gql`
  query getAttestation($id: String) {
    attestation(where: { id: $id }) {
      id
      decodedDataJson
      attester
    }
  }
`;
