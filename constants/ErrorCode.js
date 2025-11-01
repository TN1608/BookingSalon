const errorCode = {
    USER_NOT_FOUND: {
        code: 404,
        message: 'User not found'
    },
    UNAUTHORIZED: {
        code: 401,
        message: 'User not authenticated',
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        message: 'Internal server error',
    },
    BAD_REQUEST: {
        code: 400,
        message: 'Bad request',
    },
    NOT_FOUND: {
        code: 404,
        message: 'Resource not found',
    },
    INVALID_TOKEN: {
        code: 401,
        message: 'Invalid token',
    },
    EMAIL_EXISTS: {
        code: 422,
        message: 'Email is already in use',
    },
    EMAIL_OR_PASSWORD_INVALID: {
        code: 422,
        message: 'Email and password are required',
    },
    EMAIL_IS_REQUIRED: {
        code: 422,
        message: 'Email is required',
    },
    PASSWORD_IS_REQUIRED: {
        code: 422,
        message: 'Password is required',
    },
//     GENERAL
    NAME_IS_REQUIRED: {
        code: 422,
        message: 'Name is required',
    },
    PRICE_IS_REQUIRED: {
        code: 422,
        message: 'Price is required',
    },

// ITEMS
    ITEM_TYPE_IS_REQUIRED: {
        code: 422,
        message: 'Item type is required',
    },
    ITEM_NOT_FOUND: {
        code: 404,
        message: 'Item not found',
    },
    ITEM_ALREADY_EXISTS: {
        code: 422,
        message: 'Item already exists',
    },
    ITEM_TYPE_NOT_FOUND: {
        code: 404,
        message: 'Item type not found',
    },
// CATEGORIES
    CATEGORY_NOT_FOUND: {
        code: 404,
        message: 'Category not found',
    },
    CATEGORY_ALREADY_EXISTS: {
        code: 422,
        message: 'Category already exists',
    },
// MODIFIER ITEMS
    MODIFIER_ITEM_NOT_FOUND: {
        code: 404,
        message: 'Modifier item not found',
    },
    MODIFIER_ITEM_ALREADY_EXISTS: {
        code: 422,
        message: 'Modifier item already exists',
    },
// MODIFIER GROUPS
    MODIFIER_GROUP_NOT_FOUND: {
        code: 404,
        message: 'Modifier group not found',
    },
    MODIFIER_GROUP_ALREADY_EXISTS: {
        code: 422,
        message: 'Modifier group already exists',
    },

//     Cart items
    CART_ITEM_NOT_FOUND: {
        code: 404,
        message: 'Cart item not found',
    },
    CART_ITEM_ALREADY_EXISTS: {
        code: 422,
        message: 'Cart item already exists',
    },
    INVALID_QUANTITY: {
        code: 422,
        message: 'Invalid quantity',
    },
//     Cart
    CART_NOT_FOUND: {
        code: 404,
        message: 'Cart not found',
    },
    CART_ALREADY_EXISTS: {
        code: 422,
        message: 'Cart already exists',
    },
//     Transactions
    TRANSACTION_NOT_FOUND: {
        code: 404,
        message: 'Transaction not found',
    },
    TRANSACTION_ALREADY_EXISTS: {
        code: 422,
        message: 'Transaction already exists',
    },
//     Orders
    ORDER_NOT_FOUND: {
        code: 404,
        message: 'Order not found',
    }
}

module.exports = errorCode;