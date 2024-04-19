import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import * as _ from "lodash";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHooks";
import { setStatusSaveCourse } from "@/redux/features/courseSlice";
import { AiTwotoneDelete } from "react-icons/ai";
import { BiMessageSquareAdd } from "react-icons/bi";
import {
  CourseDescriptionField,
  StatusCode,
  ToastMessage,
  ToastStatus,
} from "@/utils/resources";
import { formCourseContentSchema } from "@/utils/formSchema";
import Content from "@/types/content.type";
import { newLineRegex } from "@/utils/regex";
import {
  useAddContentMutation,
  useUpdateContentMutation,
} from "@/redux/services/contentApi";
import showToast from "@/utils/showToast";
import { DataResponse } from "@/types/response.type";

interface ContentProps {
  content: Content | null;
  courseId: string;
}
let initialSchema = formCourseContentSchema;
const data: Record<string, any> = {};

const addFieldToDataAndSchema = (
  fieldName: string,
  fieldValue: string,
  fieldArray: string[]
) => {
  data[fieldName] = fieldValue;
  initialSchema = initialSchema.extend({
    [fieldName]: z
      .string()
      .min(1)
      .refine((value) => !newLineRegex.test(value), {
        message: "Vui Lòng Không Điền /n",
      }),
  });
  fieldArray.push(fieldName);
};

const handleSetDefaultValueForm = (content: Content | null) => {
  if (content?.id) {
    const requirements: string[] = content.description.requirements.split("/n");
    const details: string[] = content.description.details.split("/n");
    const targetConsumers: string[] =
      content.description.targetConsumers.split("/n");

    let requirementsFields: string[] = ["requirement"];
    let detailsFields: string[] = ["detail"];
    let targetConsumersFields: string[] = ["targetConsumer"];

    requirements.forEach((requirement, index) => {
      if (index !== 0) {
        const fieldName = `requirement${index + 1}`;
        addFieldToDataAndSchema(fieldName, requirement, requirementsFields);
      } else {
        data["requirement"] = requirement;
      }
    });

    details.forEach((detail, index) => {
      if (index !== 0) {
        const fieldName = `detail${index + 1}`;
        addFieldToDataAndSchema(fieldName, detail, detailsFields);
      } else {
        data["detail"] = detail;
      }
    });

    targetConsumers.forEach((targetConsumer, index) => {
      if (index !== 0) {
        const fieldName = `targetConsumer${index + 1}`;
        addFieldToDataAndSchema(
          fieldName,
          targetConsumer,
          targetConsumersFields
        );
      } else {
        data["targetConsumer"] = targetConsumer;
      }
    });
    console.log(data);
    return {
      data: data,
      initialSchema: initialSchema,
      requirementsFields: requirementsFields,
      detailsFields: detailsFields,
      targetConsumersFields: targetConsumersFields,
    };
  }
  return {
    data: {},
    requirementsFields: ["requirement"],
    initialSchema: formCourseContentSchema,
    detailsFields: ["detail"],
    targetConsumersFields: ["targetConsumer"],
  };
};

function CourseContentForm(props: ContentProps) {
  const { content, courseId } = props;
  const [defaultValueForm, setDefaultValueForm] = useState(
    handleSetDefaultValueForm(content)
  );
  const [requirementFields, setRequirementFields] = useState(
    defaultValueForm.requirementsFields as string[]
  );
  const [detailFields, setDetailFields] = useState(
    defaultValueForm.detailsFields as string[]
  );
  const [targetConsumerFields, setTargetConsumerFields] = useState(
    defaultValueForm.targetConsumersFields as string[]
  );
  const [schema, setSchema] = useState(defaultValueForm.initialSchema);
  const formRef = useRef<HTMLFormElement>(null);
  const saveStatus = useAppSelector(
    (state) => state.courseReducer.saveCourseStatus
  );
  const dispatch = useAppDispatch();
  const [addContent] = useAddContentMutation();
  const [updateContent] = useUpdateContentMutation();

  const handleAddContent = async (newContent: Content) => {
    await addContent(newContent)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        handleToast(fulfilled);
      });
  };
  const handleUpdateContent = async (newContent: Content) => {
    await updateContent(newContent)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        handleToast(fulfilled);
      });
  };
  const handleToast = (dataResult: DataResponse) => {
    if (dataResult?.statusCode === StatusCode.REQUEST_SUCCESS) {
      showToast(ToastStatus.SUCCESS, ToastMessage.UPDATE_CONTENT_SUCCESS);
    } else {
      showToast(ToastStatus.ERROR, ToastMessage.UPDATE_CONTENT_FAIL);
    }
  };
  useEffect(() => {
    if (saveStatus && formRef.current) {
      formRef.current.requestSubmit();
      dispatch(setStatusSaveCourse(false));
    }
  }, [saveStatus]);

  useEffect(() => {
    setDefaultValueForm(handleSetDefaultValueForm(content));
  }, [content]);

  const handleAddField = (fieldType: string) => {
    let fieldName: string = "";
    if (_.isEqual(fieldType, CourseDescriptionField.REQUIREMENT)) {
      fieldName = `requirement${requirementFields.length + 1}`;
      setRequirementFields([...requirementFields, fieldName]);
    }

    if (_.isEqual(fieldType, CourseDescriptionField.DETAIL)) {
      fieldName = `detail${detailFields.length + 1}`;
      setDetailFields([...detailFields, fieldName]);
    }

    if (_.isEqual(fieldType, CourseDescriptionField.TARGET_CONSUMER)) {
      fieldName = `targetConsumer${targetConsumerFields.length + 1}`;
      setTargetConsumerFields([...targetConsumerFields, fieldName]);
    }

    const updatedSchema = schema.extend({
      [fieldName]: z
        .string()
        .min(1)
        .refine((value) => !newLineRegex.test(value), {
          message: "Vui Lòng Không Điền /n",
        }),
    });
    console.log(fieldName);
    setSchema(updatedSchema);
  };

  const handleRemoveField = (fieldName: string, fieldType: string) => {
    let updatedFields: string[] = [];

    if (_.isEqual(fieldType, CourseDescriptionField.REQUIREMENT)) {
      updatedFields = requirementFields.filter((name) => name !== fieldName);
      setRequirementFields(updatedFields);
    }

    if (_.isEqual(fieldType, CourseDescriptionField.DETAIL)) {
      updatedFields = detailFields.filter((name) => name !== fieldName);
      setDetailFields(updatedFields);
    }

    if (_.isEqual(fieldType, CourseDescriptionField.TARGET_CONSUMER)) {
      updatedFields = targetConsumerFields.filter((name) => name !== fieldName);
      setTargetConsumerFields(updatedFields);
    }

    const updatedSchema = z.object(
      Object.fromEntries(updatedFields.map((name) => [name, z.string()]))
    );

    setSchema(updatedSchema);
  };

  const form = useForm<z.infer<typeof schema>>({
    shouldUnregister: true,
    resolver: zodResolver(schema),
    defaultValues: defaultValueForm.data,
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    console.log(values);
    const data: any = values;

    const newContent: Content = {
      description: {
        requirements: requirementFields.map((key) => data[key]).join("/n"),
        details: detailFields.map((key) => data[key]).join("/n"),
        targetConsumers: targetConsumerFields
          .map((key) => data[key])
          .join("/n"),
      },
      course: {
        id: courseId,
      },
    };
    if (content?.id) {
      newContent.id = content.id;
      handleUpdateContent(newContent);
    } else {
      handleAddContent(newContent);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          className="mx-10"
          onSubmit={form.handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div>
            <FormLabel className="text-black mb-2">
              Học viên sẽ học được những gì từ khóa học của bạn?
            </FormLabel>
            <FormDescription>
              Hãy điền các mục tiêu hoặc kết quả học tập mà người học có thể
              mong đợi đạt được sau khi hoàn thành khóa học của mình.
            </FormDescription>
            {targetConsumerFields.map((fieldName, index) => (
              <div key={fieldName} className="flex-between gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem
                      className={
                        index === targetConsumerFields.length - 1 && index !== 0
                          ? "mb-2 w-full"
                          : "mb-2 w-full mr-9"
                      }
                    >
                      <FormControl>
                        <Input
                          className="rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default border-black"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {index === targetConsumerFields.length - 1 && index !== 0 && (
                  <div
                    className="hover:cursor-pointer text-3xl pb-3"
                    onClick={() =>
                      handleRemoveField(
                        fieldName,
                        CourseDescriptionField.TARGET_CONSUMER
                      )
                    }
                  >
                    <AiTwotoneDelete />
                  </div>
                )}
              </div>
            ))}

            <div
              className="hover: cursor-pointer flex items-center text-orange-500 gap-1 mb-5"
              onClick={() =>
                handleAddField(CourseDescriptionField.TARGET_CONSUMER)
              }
            >
              <BiMessageSquareAdd /> Thêm mới
            </div>
          </div>
          <div>
            <FormLabel className="text-black mb-2">
              Các yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn
              là gì?
            </FormLabel>
            <FormDescription>
              Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị cần thiết
              mà người học nên có trước khi tham gia khóa học của bạn. Nếu không
              có yêu cầu nào, hãy sử dụng không gian này như một cơ hội để hạ
              thấp rào cản cho người mới bắt đầu.
            </FormDescription>
            {requirementFields.map((fieldName, index) => (
              <div key={fieldName} className="flex-between gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem
                      className={
                        index === requirementFields.length - 1 && index !== 0
                          ? "mb-2 w-full"
                          : "mb-2 w-full mr-9"
                      }
                    >
                      <FormControl>
                        <Input
                          className="rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default border-black"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {index === requirementFields.length - 1 && index !== 0 && (
                  <div
                    className="hover:cursor-pointer text-3xl pb-3"
                    onClick={() =>
                      handleRemoveField(
                        fieldName,
                        CourseDescriptionField.REQUIREMENT
                      )
                    }
                  >
                    <AiTwotoneDelete />
                  </div>
                )}
              </div>
            ))}

            <div
              className="hover: cursor-pointer flex items-center text-orange-500 gap-1 mb-5"
              onClick={() => handleAddField(CourseDescriptionField.REQUIREMENT)}
            >
              <BiMessageSquareAdd /> Thêm mới
            </div>
          </div>

          <div>
            <FormLabel className="text-black mb-2">
              Khóa học này dành cho ai?
            </FormLabel>
            <FormDescription>
              Viết mô tả rõ ràng về những người học dự định tham gia khóa học
              của bạn, những người sẽ thấy nội dung khóa học của bạn có giá trị.
              Điều này sẽ giúp bạn thu hút những người học phù hợp vào khóa học
              của bạn.
            </FormDescription>
            {detailFields.map((fieldName, index) => (
              <div key={fieldName} className="flex-between gap-2 mt-2">
                <FormField
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem
                      className={
                        index === detailFields.length - 1 && index !== 0
                          ? "mb-2 w-full"
                          : "mb-2 w-full mr-9"
                      }
                    >
                      <FormControl>
                        <Input
                          className="rounded-none focus-visible:ring-0 disabled:opacity-1 disabled:cursor-default border-black"
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {index === detailFields.length - 1 && index !== 0 && (
                  <div
                    className="hover:cursor-pointer text-3xl pb-3"
                    onClick={() =>
                      handleRemoveField(
                        fieldName,
                        CourseDescriptionField.DETAIL
                      )
                    }
                  >
                    <AiTwotoneDelete />
                  </div>
                )}
              </div>
            ))}

            <div
              className="hover: cursor-pointer flex items-center text-orange-500 gap-1 mb-20"
              onClick={() => handleAddField(CourseDescriptionField.DETAIL)}
            >
              <BiMessageSquareAdd /> Thêm mới
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CourseContentForm;
