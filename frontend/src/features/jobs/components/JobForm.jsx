import { useState } from "react";
import { Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import { createJobAsync } from "../store/jobsSlice";
import { showError, showSuccess } from "../../../utils/alert";

function JobForm() {
  const dispatch = useDispatch();

  const creating = useSelector((state) => state.jobs.creating);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove field error while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.type.trim()) {
      newErrors.type = "Job type is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    try {
      await dispatch(
        createJobAsync({
          title: formData.title.trim(),
          type: formData.type.trim(),
        }),
      ).unwrap();

      setFormData({
        title: "",
        type: "",
      });

      setErrors({});

      await showSuccess(
        "Job Created!",
        "Your job has been added to the queue.",
      );
    } catch (error) {
      showError(
        "Failed to Create Job",
        Array.isArray(error)
          ? error.join(", ")
          : error || "Something went wrong.",
      );
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-3 px-1">
      {/* Title */}
      <Input
        id="job-title"
        name="title"
        label="Job Title"
        placeholder="e.g. Generate monthly report"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        maxLength={100}
        disabled={creating}
      />

      {/* Type */}
      <Input
        id="job-type"
        name="type"
        label="Job Type"
        placeholder="e.g. Report"
        value={formData.type}
        onChange={handleChange}
        error={errors.type}
        maxLength={50}
        disabled={creating}
      />

      {/* Submit */}
      <Button type="submit" size="md" loading={creating} className="w-full">
        {!creating && <Plus size={18} className="mr-2" />}
        Create Job
      </Button>
    </form>
  );
}

export default JobForm;
