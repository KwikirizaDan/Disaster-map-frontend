"use client";

import AuthHeader from "@/components/AuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewDisasterPage() {
  return (
    <>
      <AuthHeader />
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Report a New Disaster</CardTitle>
            <CardDescription>Fill out the form below to report a new disaster.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter a title" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter a description" />
                </div>
                <Button>Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
