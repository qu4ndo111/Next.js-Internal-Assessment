"use client"

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon, UploadCloud, FileIcon, X, Loader2, Upload } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Calendar } from "@/src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Textarea } from "@/src/components/ui/textarea";
import { getClaimById } from "@/src/services/claim";
import { createAssessment } from "@/src/services/assessment";
import { toast } from "sonner";
import { loadingService } from "@/lib/loading-service";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { ClaimType } from "@/src/types/assessment";

type TFunction = ReturnType<typeof useTranslations<"Assessments.create">>;

const getAssessmentSchema = (t: TFunction) => z.object({
    claimId: z.string().min(1, t("form.claimIdRequired")),
    insuredName: z.string().min(1, t("form.insuredNameRequired")),
    contractNo: z.string().min(1, t("form.contractNoRequired")),
    claimType: z.string().min(1, t("form.claimTypeRequired")),
    claimedAmount: z.string().min(1, t("form.claimedAmountRequired")).refine(val => !isNaN(Number(val)) && Number(val) > 0, t("form.claimedAmountRequired")),
    deadline: z.date(),
    description: z.string(),
    files: z.array(z.instanceof(File)),
    priority: z.enum(["HIGH", "MEDIUM", "LOW", "URGENT"]),
    assignedTo: z.string().min(1, t("form.assignedToRequired")),
})

export default function AssessmentForm() {
    const t = useTranslations("Assessments.create");
    const tAssessments = useTranslations("Assessments");
    const locale = useLocale();
    const router = useRouter();
    const dateLocale = locale === "vi" ? vi : enUS;

    const [files, setFiles] = useState<File[]>([]);
    const [isFetched, setIsFetched] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const newAssessmentSchema = getAssessmentSchema(t)

    const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<z.infer<typeof newAssessmentSchema>>({
        resolver: zodResolver(newAssessmentSchema),
        defaultValues: {
            claimId: "",
            insuredName: "",
            contractNo: "",
            claimType: "",
            claimedAmount: "",
            priority: "MEDIUM",
            assignedTo: "",
            description: "",
            files: [],
            deadline: new Date(),
        }
    });

    const handleFetchData = async () => {
        const claimId = watch("claimId")
        if (!claimId) return;
        setIsFetching(true);

        try {
            const response = await getClaimById(claimId);
            if (!response) {
                throw new Error("Failed to fetch assessment data");
            }
            setValue("insuredName", response.insuredName, { shouldValidate: true });
            setValue("contractNo", response.contractNo, { shouldValidate: true });
            setValue("claimType", response.claimType, { shouldValidate: true });
            setValue("claimedAmount", response.claimedAmount.toString(), { shouldValidate: true });
            setIsFetched(true)
        } catch {
            setIsFetched(false)
            toast.error(t("form.claimNotFound"));
        } finally {
            setIsFetching(false);
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles(prev => {
                const updated = [...prev, ...newFiles];
                setValue("files", updated, { shouldValidate: true })
                return updated;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => {
                const updated = [...prev, ...newFiles];
                setValue("files", updated, { shouldValidate: true })
                return updated;
            });
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
            setValue("files", updated, { shouldValidate: true })
            return updated;
        });
    };

    const uploadFiles = (files: File[]) => {
        console.log(files);

    }

    const onSubmit = async (values: z.infer<typeof newAssessmentSchema>) => {
        loadingService.show(t("form.submitting"));
        try {
            const result = await createAssessment({
                claimId: values.claimId,
                claimType: values.claimType as ClaimType,
                insuredName: values.insuredName,
                contractNo: values.contractNo,
                claimedAmount: Number(values.claimedAmount),
                priority: values.priority,
                assignedTo: values.assignedTo,
                deadline: values.deadline,
                documents: values.files,
                notes: values.description,
            });

            if (result.success) {
                toast.success("Assessment created successfully");
                router.push("/assessments");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to create assessment");
        } finally {
            loadingService.hide();
        }
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h3 className="text-lg font-medium mb-4">{t("sections.requestInfo")}</h3>
                <div className="flex flex-1 gap-2 flex-col mb-6">
                    <label htmlFor="claimId" className="text-sm font-medium leading-none required">
                        {t("fields.claimId")}
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="claimId"
                            type="text"
                            placeholder={t("fields.claimIdPlaceholder")}
                            className="w-full"
                            {...register("claimId")}
                        />
                        <Button type="button" onClick={handleFetchData} disabled={isFetched || isFetching} variant="outline" className="border-dashed">
                            {isFetching ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : ''} {t("fields.fetch")}
                        </Button>
                    </div>
                    {errors.claimId && <p className="text-sm text-destructive">{errors.claimId.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-1 gap-2 flex-col">
                        <label htmlFor="insuredName" className="text-sm font-medium leading-none required">
                            {t("fields.insuredName")}
                        </label>
                        <Input
                            id="insuredName"
                            type="text"
                            placeholder={t("fields.insuredNamePlaceholder")}
                            className="w-full"
                            disabled={isFetched}
                            {...register("insuredName")}
                        />
                        {errors.insuredName && <p className="text-sm text-destructive">{errors.insuredName.message}</p>}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="contractNo" className="text-sm font-medium leading-none required">
                            {t("fields.contractNo")}
                        </label>
                        <Input
                            id="contractNo"
                            type="text"
                            placeholder={t("fields.contractNoPlaceholder")}
                            className="w-full"
                            disabled={isFetched}
                            {...register("contractNo")}
                        />
                        {errors.contractNo && <p className="text-sm text-destructive">{errors.contractNo.message}</p>}
                    </div>
                    <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="claimType" className="text-sm font-medium leading-none required">
                            {t("fields.claimType")}
                        </label>
                        <Controller
                            name="claimType"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value} disabled={isFetched}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("fields.claimTypePlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="MEDICAL">{tAssessments("claimType.MEDICAL")}</SelectItem>
                                        <SelectItem value="ACCIDENT">{tAssessments("claimType.ACCIDENT")}</SelectItem>
                                        <SelectItem value="PROPERTY">{tAssessments("claimType.PROPERTY")}</SelectItem>
                                        <SelectItem value="DEATH">{tAssessments("claimType.DEATH")}</SelectItem>
                                        <SelectItem value="DISABILITY">{tAssessments("claimType.DISABILITY")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.claimType && <p className="text-sm text-destructive">{errors.claimType.message}</p>}
                    </div>
                    <div className="flex flex-1 flex-col gap-2 relative">
                        <label htmlFor="claimedAmount" className="text-sm font-medium leading-none required">
                            {t("fields.claimedAmount")}
                        </label>
                        <Controller
                            name="claimedAmount"
                            control={control}
                            render={({ field }) => {
                                const displayValue = field.value
                                    ? new Intl.NumberFormat("vi-VN").format(Number(field.value))
                                    : "";
                                return (
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            className="w-full pr-8"
                                            value={displayValue}
                                            placeholder={t("fields.claimedAmount")}
                                            onChange={(e) => {
                                                const rawValue = e.target.value.replace(/\D/g, "");
                                                field.onChange(rawValue ? String(rawValue) : "");
                                            }}
                                            disabled={isFetched}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₫</span>
                                    </div>
                                )
                            }}
                        />
                        {errors.claimedAmount && <p className="text-sm text-destructive">{errors.claimedAmount.message}</p>}
                    </div>
                </div>
            </div>

            <div className="h-px bg-border" />
            <div>
                <h3 className="text-lg font-medium mb-4">{t("sections.assignment")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="priority" className="text-sm font-medium leading-none required">
                            {t("fields.priority")}
                        </label>
                        <Controller
                            name="priority"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("fields.priorityPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="LOW">{tAssessments("priority.LOW")}</SelectItem>
                                        <SelectItem value="MEDIUM">{tAssessments("priority.MEDIUM")}</SelectItem>
                                        <SelectItem value="HIGH">{tAssessments("priority.HIGH")}</SelectItem>
                                        <SelectItem value="URGENT">{tAssessments("priority.URGENT")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label htmlFor="assignedTo" className="text-sm font-medium leading-none required">
                            {t("fields.assignedTo")}
                        </label>
                        <Controller
                            name="assignedTo"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={t("fields.assignedToPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="Trần Thị B">Trần Thị B</SelectItem>
                                        <SelectItem value="Phạm Văn D">Phạm Văn D</SelectItem>
                                        <SelectItem value="Nguyễn Văn F">Nguyễn Văn F</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.assignedTo && <p className="text-sm text-destructive">{errors.assignedTo.message}</p>}
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label className="text-sm font-medium leading-none required">
                            {t("fields.deadline")}
                        </label>
                        <Controller
                            name="deadline"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, locale === "vi" ? "dd/MM/yyyy" : "PPP", { locale: dateLocale }) : <span>{t("fields.deadlinePlaceholder")}</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            locale={dateLocale}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.deadline && <p className="text-sm text-destructive">{errors.deadline.message}</p>}
                    </div>

                    <div className="flex flex-1 flex-col gap-2 md:col-span-2">
                        <label className="text-sm font-medium leading-none">
                            {t("fields.documents")}
                        </label>

                        <div
                            className={cn(
                                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer",
                                isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:bg-muted/50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                            <p className="text-sm text-muted-foreground">
                                {t("fields.documentsDropzone")}
                            </p>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </div>

                        {files.length > 0 && (
                            <>
                                <div className="flex items-center flex-wrap gap-4 mt-4">
                                    {files.map((file, idx) => {
                                        const isImage = file.type.startsWith("image/");
                                        const objectUrl = isImage ? URL.createObjectURL(file) : null;

                                        return (
                                            <div key={idx} className="relative w-fit group rounded-md border bg-muted/30 p-2 flex flex-col items-center gap-2">
                                                {isImage && objectUrl ? (
                                                    <div className="relative rounded overflow-hidden">
                                                        <Image
                                                            src={objectUrl}
                                                            alt={file.name}
                                                            width={56}
                                                            height={56}
                                                            className="object-cover w-14 h-14"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="w-14 h-14 flex items-center justify-center bg-background rounded border">
                                                        <FileIcon className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                                <span className="text-xs truncate w-full text-center" title={file.name}>
                                                    {file.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(idx);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                                <Button type="button" variant="outline" className="border-dashed h-14" onClick={() => uploadFiles(files)}>
                                    <Upload className="h-4 w-4 mr-2" />
                                    <span>{t("fields.upload")}</span>
                                </Button>
                            </>
                        )}

                        {errors.files && <p className="text-sm text-destructive">{errors.files.message}</p>}
                    </div>

                    <div className="flex flex-1 flex-col gap-2 md:col-span-2">
                        <label htmlFor="notes" className="text-sm font-medium leading-none">
                            {t("fields.notes")}
                        </label>
                        <Textarea
                            id="notes"
                            placeholder={t("fields.notesPlaceholder")}
                            className="resize-none min-h-[100px]"
                            {...register("description")}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button variant="outline" asChild>
                    <Link href="/assessments">{t("actions.cancel")}</Link>
                </Button>
                <Button type="submit">{t("actions.submit")}</Button>
            </div>
        </form>
    );
}