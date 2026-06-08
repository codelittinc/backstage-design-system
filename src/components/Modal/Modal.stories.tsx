import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import Modal, { type ModalProps } from "./Modal";
import Button from "../Button";
import FormInput from "../FormInput";
import FormLabel from "../FormLabel";

function ModalDemo({
  triggerLabel = "Open modal",
  footerRenderer,
  ...modalProps
}: Omit<ModalProps, "onClose"> & {
  triggerLabel?: string;
  footerRenderer?: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>{triggerLabel}</Button>
      {open && (
        <Modal
          {...modalProps}
          onClose={close}
          footer={footerRenderer ? footerRenderer(close) : modalProps.footer}
        />
      )}
    </>
  );
}

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  render: (args) => <ModalDemo {...args} />,
  args: {
    onClose: fn(),
    title: "Modal title",
    children: "Modal body content goes here.",
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {} satisfies Story;

export const Small: Story = {
  args: {
    size: "sm",
    title: "Confirm action",
    children: "Are you sure you want to delete this item?",
  },
} satisfies Story;

export const Large: Story = {
  args: {
    size: "lg",
    title: "Create record",
    children: (
      <div className="space-y-3">
        <div>
          <FormLabel htmlFor="modal-name">Name</FormLabel>
          <FormInput id="modal-name" placeholder="Enter a name" />
        </div>
        <div>
          <FormLabel htmlFor="modal-email">Email</FormLabel>
          <FormInput id="modal-email" type="email" placeholder="name@example.com" />
        </div>
      </div>
    ),
  },
} satisfies Story;

export const WithFooter: Story = {
  args: {
    title: "Save changes?",
    children: "Your changes will be applied immediately.",
  },
  render: (args) => (
    <ModalDemo
      {...args}
      footerRenderer={(close) => (
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Save</Button>
        </>
      )}
    />
  ),
} satisfies Story;

export const NoBackdropDismiss: Story = {
  args: {
    title: "Important action",
    children:
      "This modal can only be closed via the footer buttons — clicking the backdrop or pressing Escape will not dismiss it.",
    closeOnBackdropClick: false,
    closeOnEscape: false,
  },
  render: (args) => (
    <ModalDemo
      {...args}
      footerRenderer={(close) => (
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Continue</Button>
        </>
      )}
    />
  ),
} satisfies Story;
