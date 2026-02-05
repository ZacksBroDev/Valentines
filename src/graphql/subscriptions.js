/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSharedNote = /* GraphQL */ `
  subscription OnCreateSharedNote(
    $filter: ModelSubscriptionSharedNoteFilterInput
  ) {
    onCreateSharedNote(filter: $filter) {
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
export const onUpdateSharedNote = /* GraphQL */ `
  subscription OnUpdateSharedNote(
    $filter: ModelSubscriptionSharedNoteFilterInput
  ) {
    onUpdateSharedNote(filter: $filter) {
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
export const onDeleteSharedNote = /* GraphQL */ `
  subscription OnDeleteSharedNote(
    $filter: ModelSubscriptionSharedNoteFilterInput
  ) {
    onDeleteSharedNote(filter: $filter) {
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
export const onCreateVoucherRequest = /* GraphQL */ `
  subscription OnCreateVoucherRequest(
    $filter: ModelSubscriptionVoucherRequestFilterInput
  ) {
    onCreateVoucherRequest(filter: $filter) {
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
export const onUpdateVoucherRequest = /* GraphQL */ `
  subscription OnUpdateVoucherRequest(
    $filter: ModelSubscriptionVoucherRequestFilterInput
  ) {
    onUpdateVoucherRequest(filter: $filter) {
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
export const onDeleteVoucherRequest = /* GraphQL */ `
  subscription OnDeleteVoucherRequest(
    $filter: ModelSubscriptionVoucherRequestFilterInput
  ) {
    onDeleteVoucherRequest(filter: $filter) {
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
export const onCreateVoucherTemplate = /* GraphQL */ `
  subscription OnCreateVoucherTemplate(
    $filter: ModelSubscriptionVoucherTemplateFilterInput
  ) {
    onCreateVoucherTemplate(filter: $filter) {
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
export const onUpdateVoucherTemplate = /* GraphQL */ `
  subscription OnUpdateVoucherTemplate(
    $filter: ModelSubscriptionVoucherTemplateFilterInput
  ) {
    onUpdateVoucherTemplate(filter: $filter) {
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
export const onDeleteVoucherTemplate = /* GraphQL */ `
  subscription OnDeleteVoucherTemplate(
    $filter: ModelSubscriptionVoucherTemplateFilterInput
  ) {
    onDeleteVoucherTemplate(filter: $filter) {
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
export const onCreateCard = /* GraphQL */ `
  subscription OnCreateCard($filter: ModelSubscriptionCardFilterInput) {
    onCreateCard(filter: $filter) {
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
export const onUpdateCard = /* GraphQL */ `
  subscription OnUpdateCard($filter: ModelSubscriptionCardFilterInput) {
    onUpdateCard(filter: $filter) {
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
export const onDeleteCard = /* GraphQL */ `
  subscription OnDeleteCard($filter: ModelSubscriptionCardFilterInput) {
    onDeleteCard(filter: $filter) {
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
