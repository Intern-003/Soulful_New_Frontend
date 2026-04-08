import SubCategoryItem from "../../../components/dashboard/categories/SubCategoryItem";
import { useNavigate } from "react-router-dom";

const SubCategoryPage = ({ subs, setSelected, setOpen, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <>
      {subs.map((sub) => (
        <SubCategoryItem
          key={sub.id}
          item={sub}
          onClick={() =>
            navigate(`/dashboard/subcategories/${sub.id}/products`)
          }
          onEdit={(item) => {
            setSelected(item);
            setOpen(true);
          }}
          onDelete={handleDelete}
        />
      ))}
    </>
  );
};

export default SubCategoryPage;