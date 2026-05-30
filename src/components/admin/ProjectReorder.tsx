"use client";
import { Reorder } from "framer-motion";
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProjectReorder({ initialProjects }: { initialProjects: any[] }) {
    const [projects, setProjects] = useState(initialProjects);

    const handleReorder = async (newOrder: any[]) => {
        setProjects(newOrder);
        // Logic to batch update Firestore 'order' field for every project
        for (let i = 0; i < newOrder.length; i++) {
            await updateDoc(doc(db, "projects", newOrder[i].id), { order: i });
        }
    };

    return (
        <Reorder.Group axis="y" values={projects} onReorder={handleReorder} className="space-y-4">
            {projects.map((project) => (
                <Reorder.Item key={project.id} value={project} className="p-4 bg-white rounded-lg shadow cursor-grab">
                    {project.title}
                </Reorder.Item>
            ))}
        </Reorder.Group>
    );
}