import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import Modal from "./Modal";
import Button from "../Button";
import FormInput from "../FormInput";
import FormLabel from "../FormLabel";

const meta = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
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
    footer: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Cancel
        </Button>
        <Button onClick={fn()}>Save</Button>
      </>
    ),
  },
} satisfies Story;

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          {open && (
            <Modal
              onClose={() => setOpen(false)}
              title="Interactive modal"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOpen(false)}>Confirm</Button>
                </>
              }
            >
              Press Escape or click the backdrop to close.
            </Modal>
          )}
        </>
      );
    };
    return <Demo />;
  },
} satisfies Story;
