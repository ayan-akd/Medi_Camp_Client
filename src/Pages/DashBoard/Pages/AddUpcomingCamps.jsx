/* eslint-disable react/no-unescaped-entities */
import { Controller, useForm } from "react-hook-form";
import useAuth from "../../../Hooks/useAuth";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import CustomContainer from "../../../Components/Shared/CustomContainer";
import ReactDatePicker from "react-datepicker";
import Heading from "../../../Components/Shared/Heading";
import useAxios from "../../../Hooks/useAxios";

const AddUpcomingCamps = () => {
  const { user, upFetch } = useAuth();
  const axiosSecure = useAxios();
  const hostName = user?.displayName;
  const hostEmail = user?.email;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const newCamp = {
      ...data,
      hostName,
      hostEmail,
      participants: 0,
      intPro: 0,
    };
    axiosSecure
      .post(`/upcomingCamps?email=${user?.email}`, newCamp)
      .then((res) => {
        if (res.status == 200) {
          upFetch();
          const added = toast.success("Upcoming Camp Added Successfully");
          setTimeout(() => {
            toast.dismiss(added);
          }, 2000);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  return (
    <div>
      <Helmet>
        <title>Medicamp | Add Upcoming Camps</title>
      </Helmet>
      <CustomContainer>
        <div className="my-12">
          <Heading main={"Add Upcoming"} sub={"Camps"}></Heading>
        </div>
        <form className="mb-12" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 mb-8">
            {/* camp name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Camp Name</span>
              </label>
              <label className="input-group">
                <Controller
                  name="campName"
                  control={control}
                  rules={{ required: "Camp Name is required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      placeholder="Camp Name...."
                      className={`input input-bordered w-full ${
                        errors.campName ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.campName && (
                <span className="text-error">{errors.campName.message}</span>
              )}
            </div>
            {/* target audience */}
            <div className="form-control md:ml-4">
              <label className="label">
                <span className="label-text">Target Audience</span>
              </label>
              <label className="input-group">
                <Controller
                  name="targetAudience"
                  control={control}
                  rules={{ required: "Target Audience is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className={`select select-bordered w-full ${
                        errors.targetAudience ? "select-error" : ""
                      }`}
                      defaultValue=""
                    >
                      <option disabled value="">
                        Select Category. . .
                      </option>
                      <option value="general">General Health Checkup</option>
                      <option value="pediatric">Pediatric Health Camp</option>
                      <option value="women">Women's Health Camp</option>
                      <option value="senior">
                        Senior Citizens Health Camp
                      </option>
                      <option value="dental">Dental Health Camp</option>
                    </select>
                  )}
                />
              </label>
              {errors.targetAudience && (
                <span className="text-error">
                  {errors.targetAudience.message}
                </span>
              )}
            </div>
          </div>
          {/* Specialized Services Provided */}
          <div className="md:flex mb-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  Specialized Services Provided
                </span>
              </label>
              <label className="input-group">
                <Controller
                  name="services"
                  control={control}
                  rules={{ required: "Specialized Services are required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      placeholder="Specialized Services...."
                      className={`input input-bordered w-full ${
                        errors.services ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.services && (
                <span className="text-error">{errors.services.message}</span>
              )}
            </div>
          </div>
          {/* Venue Location */}
          <div className="md:flex mb-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Camp Location</span>
              </label>
              <label className="input-group">
                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Venue Location is required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      placeholder="Venue Location..."
                      className={`input input-bordered w-full ${
                        errors.location ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.location && (
                <span className="text-error">{errors.location.message}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Camp fees */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Camp Fees</span>
              </label>
              <label className="input-group">
                <Controller
                  name="fees"
                  control={control}
                  rules={{ required: "Camp Fees is required" }}
                  render={({ field }) => (
                    <input
                      type="number"
                      {...field}
                      placeholder="Camp Fees..."
                      className={`input input-bordered w-full ${
                        errors.fees ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.fees && (
                <span className="text-error">{errors.fees.message}</span>
              )}
            </div>

            {/* Date and Time */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Date and Time</span>
              </label>
              <label className="input-group">
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: "Date and Time is required" }}
                  render={({ field }) => (
                    <ReactDatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      showTimeSelect
                      timeFormat="h:mm aa"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Select Date and Time..."
                      className={`input input-bordered w-full ${
                        errors.time ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.time && (
                <span className="text-error">{errors.time.message}</span>
              )}
            </div>
          </div>

          {/* Comprehensive Description */}
          <div className="md:flex mb-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Details about Camp</span>
              </label>
              <label className="input-group">
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: "Details about Camp is required" }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Details about the Camp...."
                      className={`textarea w-full h-52 textarea-bordered textarea-lg ${
                        errors.description ? "textarea-error" : ""
                      }`}
                    ></textarea>
                  )}
                />
              </label>
              {errors.description && (
                <span className="text-error">{errors.description.message}</span>
              )}
            </div>
          </div>
          {/* image url */}
          <div className="mb-8">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <label className="input-group">
                <Controller
                  name="imageURL"
                  control={control}
                  rules={{ required: "Image URL is required" }}
                  render={({ field }) => (
                    <input
                      type="text"
                      {...field}
                      placeholder="Photo URL"
                      className={`input input-bordered w-full ${
                        errors.imageURL ? "input-error" : ""
                      }`}
                    />
                  )}
                />
              </label>
              {errors.imageURL && (
                <span className="text-error">{errors.imageURL.message}</span>
              )}
            </div>
          </div>
          <button type="submit" className="w-full bg-rose text-white btn">
            Add Upcoming Camp
          </button>
        </form>
      </CustomContainer>
    </div>
  );
};

export default AddUpcomingCamps;
