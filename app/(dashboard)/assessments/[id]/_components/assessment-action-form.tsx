"use client"

import { Assessment, AssessmentStatus } from "@/src/types/assessment";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { updateAssessment } from "@/src/services/assessment";
import { useDispatch } from "react-redux";
import { updateAssessmentStatus } from "@/src/store/features/assessmentsSlice";

export default function AssessmentActionForm(props: Assessment) {
    const t = useTranslations("Assessments");
    const dispatch = useDispatch();

    const [message, setMessage] = useState<string>("");

    const update = async (status: AssessmentStatus) => {
        if (!message.trim()) {
            toast.warning(t("toasts.messageRequired"));
            return;
        }
        const previousStatus = props.status;
        try{
            dispatch(updateAssessmentStatus({ id: props.id, status, updateMessage: message }));

            const res = await updateAssessment(props.id, status, message);
            if(res.success) {
                toast.success(t("toasts.updateSuccess", { id: props.id }));
            } else {
                throw new Error("failed")
            }
        }catch {
            dispatch(updateAssessmentStatus({ id: props.id, status: previousStatus, updateMessage: '' }));
            toast.error(t("toasts.updateError", { id: props.id }));
        }
    }

    return (
        <Card className="shadow-md border-primary/20 bg-linear-to-b from-card to-muted/20">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    {t("quickReview.title")}
                </CardTitle>
                <CardDescription>
                    {t("quickReview.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="">
                    <label htmlFor="reviewNote" className="text-sm text-muted-foreground">{t("quickReview.reviewNote")}</label>
                    <Textarea id="reviewNote" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full border rounded-md p-2 text-sm" placeholder={t("quickReview.reviewNotePlaceholder")} />
                </div>
                <Button disabled={props.status === 'ADDITIONAL_INFO_REQUESTED'} onClick={() => update("APPROVED")} className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {t("actions.quickApprove")}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => update("ADDITIONAL_INFO_REQUESTED")} disabled={props.status === 'ADDITIONAL_INFO_REQUESTED'} className="text-purple-600 border-purple-200 hover:bg-purple-50">
                        <Clock className="mr-1 h-4 w-4" />
                        {t("actions.requestInfo")}
                    </Button>
                    <Button variant="outline" onClick={() => update("REJECTED")} className="text-red-600 border-red-200 hover:bg-red-50">
                        <XCircle className="mr-1 h-4 w-4" />
                        {t("actions.reject")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}