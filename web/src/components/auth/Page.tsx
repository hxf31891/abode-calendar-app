import { ReactNode } from "react";

const AuthPage = ({ children }: { children: ReactNode }) => {
  return (
    <div className="page jc-ac">
      <div>{children}</div>
    </div>
  );
};

export default AuthPage;
