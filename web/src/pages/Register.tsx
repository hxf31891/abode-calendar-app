// External Imports
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

// Internal Imports
import Input from "components/form/Input";
import { useApp } from "context/useApp";
import Logo from "components/Logo";
import { signup } from "api/auth";
// types
import { RegisterForm } from "types/forms";

const Register = () => {
  const navigate = useNavigate();
  const { setLoading } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    const { email, password, lastName, firstName } = data;

    try {
      const user = await signup(email.toLowerCase(), password, {
        firstName,
        lastName,
      });
      if (user) {
        navigate("/verify-email");
        setLoading(false);
      } else {
        setLoading(false);
        window.alert("Something went wrong, please try again!");
      }
    } catch (err: any) {
      window.alert(err.message || "Something went wrong, please try again!");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-container shadow-sm">
        <div className="d-flex align-items-center flex-column">
          <Logo className="pb-3 mt-2" />
          <h1>Register</h1>
          <h4 className="mt-2 mb-3">Welcome!</h4>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="First Name"
            error={errors.firstName}
            formData={{ ...register("firstName", { required: true }) }}
          />
          <Input
            label="Last Name"
            error={errors.lastName}
            formData={{ ...register("lastName", { required: true }) }}
          />
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
            id="register-submit-btn"
            className="mt-4"
            type="submit"
            value="Next"
          />
        </form>

        <div className="d-flex justify-content-center">
          <div onClick={() => navigate("/login")} className="text-btn mt-3">
            Sign In
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
