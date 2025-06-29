/**
 * Form validation utilities for order form
 */

export interface OrderData {
  name: string;
  slackId: string;
  product: string;
  size: string;
  comment?: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: Record<string, string>;
}

/**
 * Validates Slack ID format
 * @param slackId Slack ID to validate
 * @returns Boolean indicating if Slack ID is valid
 */
export function isValidSlackId(slackId: string): boolean {
  const slackIdRegex = /^@[a-zA-Z0-9._-]+$/;
  return slackIdRegex.test(slackId);
}

/**
 * Validates order data
 * @param data Order data to validate
 * @returns Validation result with success status and any errors
 */
export function validateOrderData(data: Partial<OrderData> | unknown): ValidationResult {
  const errors: Record<string, string> = {};

  // Check if required fields exist
  if (!data) {
    return { success: false, errors: { general: 'No data provided' } };
  }

  // Type guard to check if data is an object
  if (typeof data !== 'object' || data === null) {
    return { success: false, errors: { general: 'Invalid data format' } };
  }

  // Now TypeScript knows data is an object, we can safely access its properties
  const orderData = data as Partial<OrderData>;

  // Validate name
  if (!orderData.name || typeof orderData.name !== 'string' || orderData.name.trim().length < 2) {
    errors.name = 'Name is required and must be at least 2 characters';
  }

  // Validate slackId
  if (!orderData.slackId || typeof orderData.slackId !== 'string' || !isValidSlackId(orderData.slackId)) {
    errors.slackId = 'Valid Slack ID is required (e.g. @username)';
  }

  // Validate size
  if (!orderData.size || typeof orderData.size !== 'string' || orderData.size.trim().length === 0) {
    errors.size = 'Size is required';
  }

  // Validate product
  if (!orderData.product || typeof orderData.product !== 'string' || orderData.product.trim().length === 0) {
    errors.product = 'Product is required';
  }

  // Validate comment (optional)
  if (orderData.comment && typeof orderData.comment !== 'string') {
    errors.comment = 'Comment must be a string';
  }

  return {
    success: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined
  };
}

/**
 * Client-side form validation schema for React Hook Form
 */
export const orderFormValidation = {
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    }
  },
  slackId: {
    required: 'Slack ID is required',
    validate: (value: string) => isValidSlackId(value) || 'Please enter a valid Slack ID (e.g. @username)'
  },
  size: {
    required: 'Size is required'
  },
  product: {
    required: 'Product is required'
  }
};
