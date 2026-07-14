import { useAddSource, type SourceAddRequest } from '@/api/sources/addSource';
import { useDeleteSource } from '@/api/sources/deleteSource';
import { useGetSourcesQuery } from '@/api/sources/getSources';
import { useUpdateSource, type SourceUpdateRequest } from '@/api/sources/updateSource';
import useDialogState from '@/hooks/use-dialog-state';
import { type RefetchOptions } from "@tanstack/react-query";
import React, { useCallback, useState } from 'react';
import { toast } from 'sonner';
import type { Source } from '../data/schema';

type SourcesDialogType = 'create' | 'update' | 'delete'

type SourcesContextType = {
  open: SourcesDialogType | null
  setOpen: (str: SourcesDialogType | null) => void
  currentRow: Source | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Source | null>>
  add: (source: SourceAddRequest) => void
  deleteById: (id: string) => Promise<void>
  update: (source: SourceUpdateRequest) => void
  data: Source[] | undefined,
  isFetching: boolean
  refetch: (options?: RefetchOptions) => void
}

const SourcesContext = React.createContext<SourcesContextType | null>(null)

export function SourcesProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<SourcesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Source | null>(null)
  
  const { data, isFetching, refetch } = useGetSourcesQuery({})

  const addState = useAddSource()
  const add = useCallback(async (source: SourceAddRequest) => {
    try {
      await addState.mutateAsync(source)
      setOpen(null)
      toast.success('add success')
    } catch (err) {
      toast.error(err?.response?.data, {duration: 10000})
      throw err
    }
  }, [addState, setOpen])

  const updateState = useUpdateSource()
  const update = useCallback(async (source: SourceUpdateRequest) => {
    try {
      await updateState.mutateAsync(source)
      setOpen(null)
      toast.success('update success')
    } catch (err) {
      toast.error(err?.response?.data, {duration: 10000})
      throw err
    }
  }, [updateState, setOpen])

  const deleteState = useDeleteSource()
  const deleteById = useCallback(async (id: string) => {
    try {
      await deleteState.mutateAsync({ id: id })
      setOpen(null)
      toast.success('delete success')
    } catch (err) {
      toast.error('delete failed')
      throw err
    }
  }, [deleteState, setOpen])

  return (
    <SourcesContext value={{ open, setOpen, currentRow, setCurrentRow, add, deleteById, update, data, isFetching, refetch }}>
      {children}
    </SourcesContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSources = () => {
  const sourcesContext = React.useContext(SourcesContext)

  if (!sourcesContext) {
    throw new Error('useSources has to be used within <SourcesContext>')
  }

  return sourcesContext
}
