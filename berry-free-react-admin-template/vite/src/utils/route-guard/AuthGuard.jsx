import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

//-----------------------|| AUTH GUARD ||-----------------------//

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
    const account = useSelector((state) => state.account);
    const { isLoggedIn } = account;

    if (!isLoggedIn) {
        return <Navigate to="/pages/login" />;
    }

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;
