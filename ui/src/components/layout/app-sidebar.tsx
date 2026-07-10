import { Home } from "@/features/home";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarProvider } from "../ui/sidebar";
import { Checkbox } from "../ui/checkbox";
import { Field } from "../ui/field";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import { Label } from "../ui/label";

export function AppSidebar() {
    
  return (
    <SidebarProvider>
        <Sidebar collapsible={'none'} variant={'floating'}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Sections</SidebarGroupLabel>
                    <SidebarMenu>
                        {/* group */}
                        <Collapsible asChild className='group/collapsible'>
                            <SidebarMenuItem>
                                <Field orientation={'horizontal'}>
                                    <Checkbox id="default-group" name="Default Group" />
                                    <CollapsibleTrigger asChild> 
                                            <SidebarMenuButton className="p-0" tooltip={"Default group"}>
                                                Default Group
                                                <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180' />
                                            </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                </Field>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <Field orientation={'horizontal'}>
                                                <Checkbox id="default-source" name="Default Source" />
                                                <Label htmlFor="default-source">Default Source</Label>
                                            </Field>
                                        </SidebarMenuSubItem>

                                        <SidebarMenuSubItem>
                                            <Field orientation={'horizontal'}>
                                                <Checkbox id="default-source1" name="Default Source1" />
                                                <Label htmlFor="default-source1">Default Source1</Label>
                                            </Field>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                               
                            </SidebarMenuItem>
                        </Collapsible>

                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
        <div className="w-full">
            <Home />
        </div>
    </SidebarProvider>
  )
}