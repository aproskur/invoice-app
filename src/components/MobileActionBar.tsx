export const MobileActionBar = ({ onEdit, onDelete, onMarkAsPaid }: {
    onEdit: () => void;
    onDelete: () => void;
    onMarkAsPaid: () => void;
  }) => {
    return (
      <div className="dark:bg-panel-darker fixed bottom-0 left-0 w-full bg-white px-4 py-4 flex justify-between sm:hidden shadow-md z-50">
        <button
          onClick={onEdit}
          className="bg-panel-dark text-white px-4 py-2 rounded-full hover:opacity-90"     >
        
          Edit
          </button>
        <button
          onClick={onDelete}
          className="bg-danger text-white text-sm px-4 py-2 rounded-full hover:opacity-90"
        >
          Delete
        </button>
        <button
          onClick={onMarkAsPaid}
          className="bg-primary text-white text-sm px-4 py-2 rounded-full hover:opacity-90"
        >
          Mark as Paid
        </button>
      </div>
    );
  };
  