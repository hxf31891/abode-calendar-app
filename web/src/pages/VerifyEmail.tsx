// External Imports
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

// Internal Imports
import { verifyConfirmationCode, resendConfirmationCode } from "api/auth";
import Input from "components/form/Input";
import { useApp } from "context/useApp";
import Logo from "components/Logo";
// types
import { VerifyForm } from "types/forms";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { setUser, setLoading } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyForm>();

  const onSubmit: SubmitHandler<VerifyForm> = async (data) => {
    setLoading(true);
    const { code } = data;

    try {
      const { data } = await verifyConfirmationCode(code);
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
          <h1>Verify Email</h1>
          <h4 className="mt-2 mb-3">We sent a code to your inbox</h4>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Code"
            error={errors.code}
            formData={{ ...register("code", { required: true }) }}
          />
          <input
            id="verify-submit-btn"
            className="mt-4"
            type="submit"
            value="Done"
          />
        </form>

        <div className="d-flex justify-content-between ps-3 pe-3">
          <div onClick={() => navigate("/register")} className="text-btn mt-3">
            Back
          </div>
          <div onClick={resendConfirmationCode} className="text-btn mt-3">
            Resend
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
