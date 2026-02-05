/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSharedNote = /* GraphQL */ `
  query GetSharedNote($id: ID!) {
    getSharedNote(id: $id) {
      id
      content
      from
      read
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listSharedNotes = /* GraphQL */ `
  query ListSharedNotes(
    $filter: ModelSharedNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSharedNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        content
        from
        read
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVoucherRequest = /* GraphQL */ `
  query GetVoucherRequest($id: ID!) {
    getVoucherRequest(id: $id) {
      id
      voucherType
      voucherTitle
      requestedDate
      status
      counterDate
      adminNote
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listVoucherRequests = /* GraphQL */ `
  query ListVoucherRequests(
    $filter: ModelVoucherRequestFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVoucherRequests(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        voucherType
        voucherTitle
        requestedDate
        status
        counterDate
        adminNote
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getVoucherTemplate = /* GraphQL */ `
  query GetVoucherTemplate($id: ID!) {
    getVoucherTemplate(id: $id) {
      id
      type
      title
      description
      options
      monthlyLimit
      iconName
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listVoucherTemplates = /* GraphQL */ `
  query ListVoucherTemplates(
    $filter: ModelVoucherTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVoucherTemplates(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        type
        title
        description
        options
        monthlyLimit
        iconName
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCard = /* GraphQL */ `
  query GetCard($id: ID!) {
    getCard(id: $id) {
      id
      text
      emoji
      category
      subCategory
      rarity
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listCards = /* GraphQL */ `
  query ListCards(
    $filter: ModelCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        emoji
        category
        subCategory
        rarity
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
