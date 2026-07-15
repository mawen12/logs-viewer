import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

export interface NodeBase {
    id: string
    label: string
}

export interface GroupNode extends NodeBase {
    type: 'group'
    children: TreeNode[]
}

export interface SourceNode extends NodeBase {
    type: 'source'
    parentId: string
}

export type TreeNode = GroupNode | SourceNode

function isChildrenNode(node: TreeNode) {
    return node.type === 'source'
}

export function SourceGroupTree({ nodes }: { nodes: TreeNode[] }) {

    const parentMap = useMemo((): Map<string, TreeNode> => {
        const parentMap = new Map<string, TreeNode>()
        nodes.forEach((node) => {
            parentMap.set(node.id, node)
        })

        return parentMap
    }, [nodes])

    

    const [selected, _setSelected] = useState<Set<string>>(new Set<string>())
    const toggleSelect = useCallback((node: TreeNode) => {
        _setSelected((prev) => {
            const next = new Set(prev)

            if (next.has(node.id)) {
                next.delete(node.id)
                if (node.type == "group") {
                    node.children.forEach((c) => next.delete(c.id))
                } else {
                    next.delete(node.parentId)
                }
            } else {
                next.add(node.id)
                if (node.type === "group") {
                    node.children.forEach((c) => next.add(c.id))
                } else {
                    const parentNode = parentMap.get(node.parentId)
                    if (parentNode?.children.every((c) => next.has(c.id))) {
                        next.add(node.parentId)
                    }
                }
            }

            return next
        })
    }, [parentMap])


    const isSelected = useCallback((node: TreeNode): boolean => selected.has(node.id), [selected])

    return (
        <ul>
            {nodes.map((node) => (
                <TreeItem key={node.id} node={node} checkSelected={isSelected} toggleSelect={toggleSelect} />
            ))}
        </ul>
    )
}

function TreeItem({ node, checkSelected, toggleSelect }: { node: TreeNode, checkSelected: (node: TreeNode) => boolean, toggleSelect: (node: TreeNode) => void }) {
    const isChecked = useMemo(() => {
        if (node.type === "group") {
            if (checkSelected(node)) {
                return true
            } else if (node.children.some((c) => checkSelected(c))) {
                return "indeterminate" as const
            } else {
                return false
            }
        } else {
            return checkSelected(node)
        }
    }, [node, checkSelected])

    if (isChildrenNode(node)) {
        return (
            <li className="px-2 py-1 text-sm">
                <Field orientation={'horizontal'}>
                    <Checkbox
                        id={`${node.id}-${node.label}`}
                        name={node.label}
                        checked={isChecked}
                        onCheckedChange={() => toggleSelect(node)}
                    />
                    <Label className="cursor-pointer" htmlFor={`${node.id}-${node.label}`}>{node.label}</Label>
                </Field>
            </li>
        )
    }

    return (
        <li className="px-2 py-1 text-sm">
            <Collapsible className='group/collapsible w-full rounded-md'>
                <Field orientation={'horizontal'} className="w-full">
                    <Checkbox
                        id={`${node.id}-${node.label}`}
                        name={node.label}
                        checked={isChecked}
                        onCheckedChange={() => toggleSelect(node)}
                    />
                    <CollapsibleTrigger asChild>
                        <Button className="h-7 " title={node.label} variant={"ghost"}>
                            {node.label}
                            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
                        </Button>
                    </CollapsibleTrigger>
                </Field>
                <CollapsibleContent>
                    <ul className="ml-1 border-l pl-1">
                        {node.children!.map((child) => (
                            <TreeItem key={child.id} node={child} checkSelected={checkSelected} toggleSelect={toggleSelect} />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

