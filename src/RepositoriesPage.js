import {
  AppBar,
  Card,
  IconButton,
  Toolbar,
  styled,
  CardContent,
  CardHeader,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { common } from "@mui/material/colors";
import { GitHub } from "@mui/icons-material";

const RepoCard = styled(Card)(() => ({
  width: "300px",
  backgroundColor: "#35284f",
  color: "white",
}));

const FileCard = styled(CardContent)(() => ({
  backgroundColor: "#35284f",
  color: "white",
  width: "60%",
  height: "550px",
  overflowX: "scroll",
  overflowY: "scroll",

  "&::-webkit-scrollbar": {
    scrollbarWidth: "thin",
  },
  "&::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px #271150",
    webkitBoxShadow: "inset 0 0 #0d0221",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#583e89",
    outline: "1px solid #422e68",
  },
}));

const NavBar = styled(AppBar)(() => ({
  color: common["white"],

  backgroundColor: "#0d0221",
}));

function RepositoriesPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const owner = params.get("owner");
  const repo = params.get("repo");
  const navigate = useNavigate();

  const Home = () => {
    navigate(`/`);
  };

  const [repoContents, setRepoContents] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (owner && repo) {
      fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {})
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setRepoContents(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [owner, repo]);

  const handleFileClick = (file) => {
    if (file.type === "file") {
      fetch(file.download_url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((content) => {
          setFileContent(content);
        })
        .catch((error) => {
          setError(error);
        });
    } else {
      setFileContent(null);
    }
  };

  return (
    <>
      <div className="navbar">
        <NavBar>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={Home}
            >
              <ArrowBackIcon />
            </IconButton>
            <GitHub />
          </Toolbar>
        </NavBar>
      </div>
      <div className="container">
        <RepoCard variant="outlined">
          <CardHeader title="Repository Contents" />
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <ul>
              {repoContents.map((item) => (
                <li
                  className="data"
                  key={item.sha}
                  onClick={() => handleFileClick(item)}
                >
                  {item.type === "dir" ? (
                    <strong>Directory: </strong>
                  ) : (
                    <strong>File: </strong>
                  )}
                  {item.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </RepoCard>
        <FileCard>
          <CardHeader title="File Content" />
          <CardContent>{fileContent && <pre>{fileContent}</pre>}</CardContent>
        </FileCard>
      </div>
    </>
  );
}

export default RepositoriesPage;
