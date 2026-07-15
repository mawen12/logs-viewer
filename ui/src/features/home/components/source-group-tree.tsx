import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useQueryStore } from "@/store/use-query-store";
import { ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

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
    const { sources, updateSource, hasSource } = useQueryStore()

    const parentMap = useMemo((): Map<string, TreeNode> => {
        const parentMap = new Map<string, TreeNode>()
        nodes.forEach((node) => {
            parentMap.set(node.id, node)
        })

        return parentMap
    }, [nodes])

    const toggleSelect = useCallback((node: TreeNode) => {
            updateSource(node, parentMap.get(node?.parentId))
    }, [parentMap, updateSource])

    return (
        <ul>
            {nodes.map((node) => (
                <TreeItem key={node.id} node={node} checkSelected={() => hasSource(node.id)} selected={hasSource(node.id)} toggleSelect={toggleSelect} />
            ))}

            {sources.size}
        </ul>
    )
}

function TreeItem({ node, checkSelected, selected, toggleSelect }: { node: TreeNode, checkSelected: (node: TreeNode) => boolean, selected: boolean, toggleSelect: (node: TreeNode) => void }) {
    const { sources, hasSource } = useQueryStore()

    const isChecked = useMemo(() => {
        if (node.type === "group") {
            if (selected) {
                return true
            } else if (node.children.some((c) => hasSource(c.id))) {
                return "indeterminate" as const
            } else {
                return false
            }
        } else {
            return selected
        }
    }, [sources])

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
                            <TreeItem key={child.id} node={child} checkSelected={checkSelected} selected={hasSource(child.id)} toggleSelect={toggleSelect} />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    )
}

