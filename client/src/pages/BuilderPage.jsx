import BuilderHeader from "../components/BuilderHeader";
import Loading from "../components/Loading.jsx";
import ChatPannel from "../components/ChatPannel.jsx";
import FileExplorer from "../components/FileExplorer.jsx";
import PreviewPanel from "../components/PreviewPanel.jsx"
import AgentProgressDashboard from "../components/AgentProgressDashboard.jsx"
import PublishModel from "../components/PublishModel.jsx"
import {exportProjectZip} from "../utils/exportProject.js"
  
import React, { useEffect, useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import {
  MessageSquareIcon,
  FolderTreeIcon,
} from "lucide-react";
import api from "../api/api"

const BuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leftTab, setLeftTab] = useState("chat");
  const [publishing, setPublishing] = useState(false);
  const [publishUrl, setPublishUrl] = useState(null);

  const {
    activeProject,
    loadingActiveProject,
    showCode,
    setShowCode,
    loadProject,
    logout,
    chatLoading,
    handleChat,
    activeFile,
    setActiveFile,
  } = useAppContext();

  // Load project
  useEffect(() => {
    if (!id) return;

    loadProject(id);
  }, [id, loadProject]);

  // Open preview
  const handleOpenPreview = () => {
    if (!id) return;

    window.open(`/preview/${id}`, "_blank");
  };

  // Publish project
  const handlePublish = async () => {
    if (!id) return
    setPublishing(true)
    try{
      await api.post(`/api/projects/${id}/publish`)
      const url = `${window.location.origin}/publish/${id}`
      setPublishUrl(url)
      toast.success("Website Published Successfully")
    }catch(err){
      console.error("publish failed:", err)
      toast.error(err?.response?.data?.error || "Publish failed")
    }finally{
      setPublishing(false)
    }
  };

  // Download project
  const handleDownload = () => {
    if(!activeProject) return
    exportProjectZip(activeProject)
    
  };

  // Loading state
  if (loadingActiveProject || !activeProject) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden text-zinc-900 relative">

      {/* ================= HEADER ================= */}
      <BuilderHeader
        projectName={activeProject.name}
        version={activeProject.version}
        showCode={showCode}
        publishing={publishing}
        onToggleShowCode={() => setShowCode(!showCode)}
        onBack={() => navigate("/")}
        onOpenPreview={handleOpenPreview}
        onPublish={handlePublish}
        onLogout={logout}
        onDownload={handleDownload}
      />

      {/* ================= MAIN LAYOUT ================= */}
      <div className="flex-1 flex overflow-hidden">

        {/* ================= LEFT SIDEBAR ================= */}
        <div className="w-[320px] shrink-0 flex flex-col border-r border-zinc-200 bg-white">

          {/* Sidebar Tabs */}
          <div className="flex border-b border-zinc-100">

            {/* Chat Tab */}
            <button
              onClick={() => setLeftTab("chat")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === "chat"
                  ? "text-zinc-900 border-b-2 border-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <MessageSquareIcon size={13} />
              Chat
            </button>

            {/* Files Tab */}
            <button
              onClick={() => setLeftTab("files")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium cursor-pointer ${
                leftTab === "files"
                  ? "text-zinc-900 border-b-2 border-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              <FolderTreeIcon size={13} />
              Files
            </button>

          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-hidden">

            {leftTab === "chat" ? (
              <ChatPannel
                messages={activeProject.messages || []}
                onSend={handleChat}
                loading={chatLoading}
              />
            ) : (
              <FileExplorer
                files={activeProject.files || {}}
                activeFile={activeFile}
                onFileSelect={(path) => {
                  setActiveFile(path);
                  setShowCode(true);
                }}
              />
            )}

          </div>
        </div>

        {/* Preview/ Code Area */}
        <div className="flex-1 overflow-hidden bg-zinc-50">

          {activeProject.status === "pending" || activeProject.status === "generating" || activeProject.status === "failed" ? (
            <AgentProgressDashboard project={activeProject}/>
          ):(
            <PreviewPanel project={activeProject} activeFile={activeFile} showCode={showCode} />
          )}

        </div>
      </div>

      {publishUrl && <PublishModel publishUrl={publishUrl} onClose={()=> setPublishUrl(null)} />}
    </div>
  );
};

export default BuilderPage;