import gql from "graphql-tag";

export const MUTATION_removeService = gql`
  mutation newService($input: serviceInput) {
    removeService(input: $input) {
      name
    }
  }
`;

export const MUTATION_NewService = gql`
  mutation newService($input: serviceInput) {
    newService(input: $input) {
      name
    }
  }
`;

export const MUTATION_changeBill = gql`
  mutation changeBill($input: billInput) {
    changeBill(input: $input) {
      amount
    }
  }
`;
export const MUTATION_removeBill = gql`
  mutation removeBill($input: billInput) {
    removeBill(input: $input) {
      id
    }
  }
`;

export const MUTATION_newUser = gql`
  mutation newUser($input: userInput) {
    newUser(input: $input) {
      firstName
    }
  }
`;
