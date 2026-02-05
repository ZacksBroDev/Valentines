/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSharedNote = /* GraphQL */ `
  mutation CreateSharedNote(
    $input: CreateSharedNoteInput!
    $condition: ModelSharedNoteConditionInput
  ) {
    createSharedNote(input: $input, condition: $condition) {
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
export const updateSharedNote = /* GraphQL */ `
  mutation UpdateSharedNote(
    $input: UpdateSharedNoteInput!
    $condition: ModelSharedNoteConditionInput
  ) {
    updateSharedNote(input: $input, condition: $condition) {
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
export const deleteSharedNote = /* GraphQL */ `
  mutation DeleteSharedNote(
    $input: DeleteSharedNoteInput!
    $condition: ModelSharedNoteConditionInput
  ) {
    deleteSharedNote(input: $input, condition: $condition) {
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
export const createVoucherRequest = /* GraphQL */ `
  mutation CreateVoucherRequest(
    $input: CreateVoucherRequestInput!
    $condition: ModelVoucherRequestConditionInput
  ) {
    createVoucherRequest(input: $input, condition: $condition) {
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
export const updateVoucherRequest = /* GraphQL */ `
  mutation UpdateVoucherRequest(
    $input: UpdateVoucherRequestInput!
    $condition: ModelVoucherRequestConditionInput
  ) {
    updateVoucherRequest(input: $input, condition: $condition) {
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
export const deleteVoucherRequest = /* GraphQL */ `
  mutation DeleteVoucherRequest(
    $input: DeleteVoucherRequestInput!
    $condition: ModelVoucherRequestConditionInput
  ) {
    deleteVoucherRequest(input: $input, condition: $condition) {
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
export const createVoucherTemplate = /* GraphQL */ `
  mutation CreateVoucherTemplate(
    $input: CreateVoucherTemplateInput!
    $condition: ModelVoucherTemplateConditionInput
  ) {
    createVoucherTemplate(input: $input, condition: $condition) {
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
export const updateVoucherTemplate = /* GraphQL */ `
  mutation UpdateVoucherTemplate(
    $input: UpdateVoucherTemplateInput!
    $condition: ModelVoucherTemplateConditionInput
  ) {
    updateVoucherTemplate(input: $input, condition: $condition) {
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
export const deleteVoucherTemplate = /* GraphQL */ `
  mutation DeleteVoucherTemplate(
    $input: DeleteVoucherTemplateInput!
    $condition: ModelVoucherTemplateConditionInput
  ) {
    deleteVoucherTemplate(input: $input, condition: $condition) {
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
export const createCard = /* GraphQL */ `
  mutation CreateCard(
    $input: CreateCardInput!
    $condition: ModelCardConditionInput
  ) {
    createCard(input: $input, condition: $condition) {
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
export const updateCard = /* GraphQL */ `
  mutation UpdateCard(
    $input: UpdateCardInput!
    $condition: ModelCardConditionInput
  ) {
    updateCard(input: $input, condition: $condition) {
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
export const deleteCard = /* GraphQL */ `
  mutation DeleteCard(
    $input: DeleteCardInput!
    $condition: ModelCardConditionInput
  ) {
    deleteCard(input: $input, condition: $condition) {
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
