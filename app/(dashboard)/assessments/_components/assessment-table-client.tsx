'use client'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAssessments } from '@/src/store/features/assessmentsSlice';
import { RootState } from '@/src/store';
import { DataTable } from '@/src/components/ui/data-table';
import { columns } from './columns';
import { Assessment } from '@/src/types/assessment';

export default function AssessmentTableClient({ initialData }: { initialData: Assessment[] }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAssessments(initialData));
  }, [initialData, dispatch]);

  const assessments = useSelector((state: RootState) => state.assessments.items);

  return <DataTable columns={columns} data={assessments} />;
}
