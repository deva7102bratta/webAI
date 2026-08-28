import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import Loading from "../components/Loading.jsx";
import { AlertCircleIcon } from "lucide-react";
import FullPagePreview from "../components/FullPagePreview.jsx";
import {useAppContext} from "../contexts/AppContext.jsx"

const PreviewPage = () => {
  const { id } = useParams();
  const  {activeProject: project, loadingActiveProject: loading, loadProject } = useAppContext()
  
  useEffect(() => {
    if(id){
      loadProject(id)
    }
  }, [id, loadProject]);

  // Loading state
  if (loading || !project) {
    return <Loading />;
  }

  // Public website preview
  return <FullPagePreview files={project.files || []} />;
};

export default PreviewPage