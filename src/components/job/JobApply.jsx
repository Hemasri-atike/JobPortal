import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { BarLoader } from 'react-spinners';
import { applyToJobThunk, clearApplyState } from "../../store/jobsSlice.js"; // Redux thunk

const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

const schema = z.object({
  experience: z
    .number()
    .min(0, { message: 'Experience must be at least 0' })
    .int(),
  skills: z.string().min(1, { message: 'Skills are required' }),
  education: z.enum(['Intermediate', 'Graduate', 'Post Graduate'], {
    message: 'Education is required',
  }),
  resume: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file[0].type),
      { message: 'Only PDF or Word documents are allowed' }
    ),
});

export function JobApply({ user, job, fetchJob, applied = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { loadingApply, errorApply, successApply } = useSelector((state) => state.jobs);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('job_id', job.id);
    formData.append('candidate_id', user.id);
    formData.append('name', user.fullName);
    formData.append('status', 'applied');
    formData.append('experience', data.experience);
    formData.append('skills', data.skills);
    formData.append('education', data.education);
    formData.append('resume', data.resume[0]);

    dispatch(applyToJobThunk(formData)).then(() => {
      fetchJob();
      reset();
      setIsOpen(false);
      dispatch(clearApplyState());
    });
  };

  return (
    <>
      <Button
        className={`${
          job?.isOpen && !applied ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
        } px-6 py-2 text-base`}
        disabled={!job?.isOpen || applied}
        onClick={() => setIsOpen(true)}
      >
        {job?.isOpen ? (applied ? 'Applied' : 'Apply') : 'Hiring Closed'}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 sm:items-end">
          <div className="bg-white rounded-lg w-full max-w-md sm:rounded-b-none sm:max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Apply for {job?.title} at {job?.company?.name || job?.company}
              </h2>
              <p className="text-sm text-gray-500">Please fill the form below</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
              <div>
                <Input
                  type="number"
                  placeholder="Years of Experience"
                  className="w-full"
                  {...register('experience', { valueAsNumber: true })}
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>}
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Skills (Comma Separated)"
                  className="w-full"
                  {...register('skills')}
                />
                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      {['Intermediate', 'Graduate', 'Post Graduate'].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            value={option}
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education.message}</p>}
              </div>

              <div>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="w-full file:text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-sm"
                  {...register('resume')}
                />
                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume.message}</p>}
              </div>

              {errorApply && <p className="text-red-500 text-sm">{errorApply}</p>}

              {loadingApply && <BarLoader width="100%" color="#36d7b7" className="mt-2" />}

              <Button type="submit" className="mt-2 bg-blue-600 hover:bg-blue-700">
                Apply
              </Button>
            </form>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button
                className="bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default JobApply;
