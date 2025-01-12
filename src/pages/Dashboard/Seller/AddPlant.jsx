import { Helmet } from "react-helmet-async";
import AddPlantForm from "../../../components/Form/AddPlantForm";
import { uploadImage } from "../../../api/utils";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AddPlant = () => {
  const { user } = useAuth();
  const [uploadImages, setUploadImages] = useState({
    image: { name: "Upload Image" },
  });
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const category = form.category.value;
    const description = form.description.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];
    const imageURL = await uploadImage(image);

    // saller info
    const saller = {
      name: user?.displayName,
      email: user?.email,
      profile_image: user?.photoURL,
    };

    // create plant data in a object
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageURL,
      saller,
    };
    // save plant in db
    try {
      await axiosSecure.post("/plants", plantData);
      toast.success("Plant added successfully");
      form.reset();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Helmet>
        <title>Add Plant | Dashboard</title>
      </Helmet>

      {/* Form */}
      <AddPlantForm
        handleSubmit={handleSubmit}
        uploadImages={uploadImages}
        setUploadImages={setUploadImages}
        loading={loading}
      />
    </div>
  );
};

export default AddPlant;
