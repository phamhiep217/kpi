import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducer import
import accountReducer from './accountReducer';

//-----------------------|| COMBINE REDUCER ||-----------------------//

const reducer = combineReducers({
    account: persistReducer(
        {
            key: 'account',
            storage,
            keyPrefix: 'berry-'
        },
        accountReducer
    )
});

export default reducer;
