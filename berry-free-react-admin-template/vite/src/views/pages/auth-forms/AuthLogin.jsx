import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// actions
import { providerApi } from '../../../store-http'

// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Lấy message từ Redux store
  const message = useSelector((state) => state.account.message);
  const isLoggedIn = useSelector((state) => state.account.isLoggedIn);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const credentials = {
      username: username,
      password: password,
    };

    try {
      await dispatch(providerApi.loginUser(credentials));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Chuyển hướng khi đăng nhập thành công
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard/default'); // Thay '/dashboard' bằng route bạn muốn chuyển hướng đến
    }
  }, [isLoggedIn, navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-username-login">Username</InputLabel>
        <OutlinedInput
          id="outlined-adornment-username-login"
          type="text"
          name="username"
          value={username}
          onChange={handleUsernameChange}
          inputProps={{}}
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput, mt: 1 }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={password}
          onChange={handlePasswordChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          inputProps={{}}
          label="Password"
        />
      </FormControl>
      {message && !isLoggedIn && ( // Hiển thị message lỗi nếu có và chưa đăng nhập
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {message}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </AnimateButton>
      </Box>
    </form>
  );
}
