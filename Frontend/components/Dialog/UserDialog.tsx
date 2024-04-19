import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PersonalForm from "../Form/PersonalForm";
import { User } from "@/types/user.type";

interface UserDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: User;
}

function UserDialog(props: UserDialogProps) {
  const { isOpen, setIsOpen, user } = props;
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent className="w-[500px] flex-center flex-col">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa user</DialogTitle>
        </DialogHeader>
        <PersonalForm userInfor={user} isAdmin={true} />
      </DialogContent>
    </Dialog>
  );
}

export default UserDialog;
