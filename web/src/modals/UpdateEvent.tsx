// external imports
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// internal imports
import Modal from "components/Modal";
import Input from "components/form/Input";
import { validateTimes } from "utils/time";
import TextArea from "components/form/Textarea";
import { useCal } from "pages/Calendar/context";
import TimePicker from "components/form/TimePicker";
import DatePicker from "components/form/DatePicker";
import ColorPicker from "components/form/ColorPicker";
import { updateEvent, deleteEvent } from "api/events";
import MultiEmailInput from "components/form/MultiEmail";
// types
import { UpdateModalProps } from "types/ui";
import { AddUpdateForm } from "types/forms";

/**
 * UI component - modal with form to create new event. Uses react-use-form, docs here: https://react-hook-form.com/
 * @returns {ReactNode}
 */
const UpdateEventModal = () => {
  const { editEventModal, setEditEventModal } = useCal();
  const open = Object.keys(editEventModal).length > 0;

  const handleClose = () => {
    setEditEventModal({});
  };

  return (
    <Modal title="Update Event" open={open} handleClose={handleClose}>
      <ModalInner editEventModal={editEventModal} handleClose={handleClose} />
    </Modal>
  );
};

export default UpdateEventModal;

/**
 * UI component - modals children split into seperate component to avoid unnecessary computation on form hook
 * @param {CalEvent} editEventModal object of the event to be updated
 * @param {function} handleClose function to close the modal
 * @returns {ReactNode}
 */
const ModalInner = ({ editEventModal, handleClose }: UpdateModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddUpdateForm>();
  const [color, setColor] = useState<string>(
    editEventModal?.color || "#bed8fb"
  );
  const _invitees = editEventModal?.users?.map((i) => i?.email || "");
  const [invitees, setInvitees] = useState<string[]>(_invitees || []);
  const { updateEvents } = useCal();

  /**
   * function to call update event route, update the local events in context and close the modal
   * @param {CalEvent} updatedEvent - updated data from the use-form hook
   */
  const onSubmit: SubmitHandler<AddUpdateForm> = async (updatedEvent) => {
    try {
      const { date, endTime, startTime } = updatedEvent;
      // call the api route, notice that some data comes from the hook while colors and invitees are managed seperetly
      let { data } = await updateEvent(editEventModal.id, {
        ...updatedEvent,
        startTime: new Date(`${date} ${startTime}`),
        endTime: new Date(`${date} ${endTime}`),
        invitees,
        color,
      });
      // update the local events in context
      updateEvents([data], data.id);
      handleClose();
    } catch (err: any) {
      window.alert(err?.message || "There was an issue updating your event");
    }
  };
  // check and format times for date and time unputs
  const times = validateTimes(editEventModal);

  /**
   * delete the selected event, update local events in context & close the modal
   */
  const handleDelete = async () => {
    try {
      await deleteEvent(editEventModal.id);
      updateEvents([], editEventModal.id);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Title"
        error={errors.title}
        value={editEventModal?.title}
        formData={{ ...register("title", { required: true }) }}
      />
      <DatePicker
        label="Date"
        value={editEventModal?.startTime}
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
        value={editEventModal?.link}
        formData={{ ...register("link") }}
      />
      <TextArea
        label="Description"
        value={editEventModal?.description}
        formData={{ ...register("description") }}
      />
      <ColorPicker color={color} setColor={setColor} />
      <div className="row mt-4">
        <div className="col-4">
          <div onClick={handleClose} className="w-100 button2">
            Cancel
          </div>
        </div>
        <div className="col-4">
          <div onClick={handleDelete} className="w-100 button-caution">
            Delete
          </div>
        </div>
        <div className="col-4">
          <input type="submit" />
        </div>
      </div>
    </form>
  );
};
