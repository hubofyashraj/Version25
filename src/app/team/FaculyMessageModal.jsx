import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquareQuote } from "lucide-react";

const FaculyMessage = ({ designation, message }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <MessageSquareQuote />
      </DialogTrigger>
      <DialogContent className="border border-red-100">
        {message}
        <DialogFooter className="sm:justify-start">
          <DialogHeader>
            <DialogTitle>{`Message From ${designation}`}</DialogTitle>
          </DialogHeader>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FaculyMessage;
