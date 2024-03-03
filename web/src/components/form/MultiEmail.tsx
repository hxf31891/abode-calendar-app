import React, { Dispatch, SetStateAction } from "react";
import { ReactMultiEmail } from "react-multi-email";

const MultiEmailInput = ({
  emails,
  setEmails,
}: {
  emails: string[];
  setEmails: Dispatch<SetStateAction<string[]>>;
}) => {
  return (
    <div className="input-wrap">
      <div className="input-label">Invitees</div>
      <ReactMultiEmail
        emails={emails}
        onChange={(_emails: string[]) => {
          setEmails(_emails);
        }}
        style={{
          width: "100%",
          height: "44px",
          padding: "0px 14px",
          borderRadius: "10px",
          border: "1px solid #dde2e5",
        }}
        getLabel={(email, index, removeEmail) => {
          return (
            <div data-tag key={index}>
              <div data-tag-item>{email}</div>
              <span data-tag-handle onClick={() => removeEmail(index)}>
                ×
              </span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default MultiEmailInput;
