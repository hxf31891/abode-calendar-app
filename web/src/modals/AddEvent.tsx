// external imports
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
//, useEffect, Dispatch, SetStateAction

// internal imports
import Modal from "components/Modal";
import { createEvent } from "api/events";
import Input from "components/form/Input";
import { validateTimes } from "utils/time";
import { useCal } from "pages/Calendar/context";
import TextArea from "components/form/Textarea";
import TimePicker from "components/form/TimePicker";
import DatePicker from "components/form/DatePicker";
import ColorPicker from "components/form/ColorPicker";
import MultiEmailInput from "components/form/MultiEmail";
// types
import { AddModalProps } from "types/ui";
import { AddUpdateForm } from "types/forms";

/**
 * UI component - modal with form to create new event. Uses react-use-form, docs here: https://react-hook-form.com/
 * @returns {ReactNode}
 */
const AddEventModal = () => {
  const { addEventModal, setAddEventModal } = useCal();
  const open = Object.keys(addEventModal).length > 0;

  const handleClose = () => {
    setAddEventModal({});
  };

  return (
    <Modal title="Add Event" open={open} handleClose={handleClose}>
      <ModalInner handleClose={handleClose} addEventModal={addEventModal} />
    </Modal>
  );
};

export default AddEventModal;

/**
 * UI component - modals children split into seperate component to avoid unnecessary computation on form hook
 * @param {CalEvent} addEventModal object of the event to be created
 * @param {function} handleClose function to close the modal
 * @returns {ReactNode}
 */
const ModalInner = ({ addEventModal, handleClose }: AddModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateForm>();
  const { updateEvents } = useCal();
  const [color, setColor] = useState<string>("#bed8fb");
  const [invitees, setInvitees] = useState<string[]>([]);
  const times = validateTimes(addEventModal);

  /**
   * function to call create event route, update the local events in context and close the modal
   * @param {CalEvent} newEvent - data from the use-form hook
   */
  const onSubmit: SubmitHandler<AddUpdateForm> = async (newEvent) => {
    try {
      const { date, endTime, startTime } = newEvent;
      // call the api route, notice that some data comes from the hook while colors and invitees are managed seperetly
      let { data } = await createEvent({
        ...newEvent,
        startTime: new Date(`${date} ${startTime}`),
        endTime: new Date(`${date} ${endTime}`),
        invitees,
        color,
      });
      // add new event to the local events in context
      updateEvents([data], data.id);
      handleClose();
    } catch (err: any) {
      window.alert(err?.message || "There was an issue creating your event");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        error={errors.title}
        formData={{ ...register("title", { required: true }) }}
      />
      <DatePicker
        label="Date"
        value={addEventModal?.startTime}
        formData={{ ...register("date", { required: true }) }}
      />
      <div className="d-flex justify-content-between">
        <TimePicker
          label="Start"
          value={times.start}
          style={{ width: "49%" }}
          formData={{ ...register("startTime", { required: true }) }}
        />
        <TimePicker
          label="End"
          value={times.end}
          style={{ width: "49%" }}
          formData={{ ...register("endTime", { required: true }) }}
        />
      </div>
      <MultiEmailInput emails={invitees} setEmails={setInvitees} />
      <Input
        label="Link"
        error={errors.link}
        formData={{ ...register("link") }}
      />
      <TextArea label="Description" formData={{ ...register("description") }} />
      <ColorPicker color={color} setColor={setColor} />
      <input type="submit" className="mt-4" />
    </form>
  );
};
