// External Imports
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

// Internal Imports
import Input from "components/form/Input";
import { useApp } from "context/useApp";
import Logo from "components/Logo";
import { signin } from "api/auth";
// types
import { LoginForm } from "types/forms";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    const { email, password } = data;

    try {
      const { data } = await signin(email.toLowerCase(), password);
      if (data) {
        setUser(data);
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        window.alert("Something went wrong, please try again!");
      }
    } catch (err: any) {
      window.alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container shadow-sm">
        <div className="d-flex align-items-center flex-column">
          <Logo className="pb-3 mt-2" />
          <h1>Login</h1>
          <h4 className="mt-2 mb-3">Welcome back!</h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            error={errors.email}
            formData={{ ...register("email", { required: true }) }}
          />
          <Input
            type="password"
            label="Password"
            error={errors.password}
            formData={{ ...register("password", { required: true }) }}
          />
          <input
            id="login-submit-btn"
            className="mt-4"
            value="Login"
            type="submit"
          />
        </form>

        <div className="d-flex justify-content-center">
          <div onClick={() => navigate("/register")} className="text-btn mt-3">
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
