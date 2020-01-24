import gql from "graphql-tag";

export const MUTATION_removeService = gql`
  mutation newService($input: serviceInput) {
    removeService(input: $input) {
      name
    }
  }
`;

export const QUERY_Services = gql`
  {
    getServices {
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

export const QUERY_Bills = gql`
  query getBills($service: String) {
    getBills(service: $service) {
      dueDate
      id
      amount
      service
      paidUsers
    }
  }
`;
