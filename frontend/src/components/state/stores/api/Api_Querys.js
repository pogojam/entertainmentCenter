import gql from "graphql-tag";

export const QUERY_getUser = gql`
  query getUser($id: [String]) {
    getUser(id: $id) {
      role
      autoPay
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

export const QUERY_Bills = gql`
  query getBills($service: String) {
    getBills(service: $service) {
      dueDate
      id
      amount
      service
      paidUsers
      pastDue
    }
  }
`;
