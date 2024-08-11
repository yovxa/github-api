import React, { useState } from "react";
import { Button, FormControl, Card } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { common, deepPurple } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const SearchButton = styled(Button)(() => ({
  color: common["white"],
  borderTopLeftRadius: "0",
  borderBottomLeftRadius: "0",
  backgroundColor: "#2a1c45",
  "&:hover": {
    backgroundColor: "#413061",
  },
}));

const Input = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    color: common["white"],
    borderRadius: 4,
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    position: "relative",
    backgroundColor: "#2a1c45",
    border: "1px solid",
    borderColor: "#2a1c45",
    fontSize: 16,
    width: "300px",
    padding: "10px 12px",
    transition: theme.transitions.create([
      "border-color",
      "background-color",
      "box-shadow",
    ]),
    "&:focus": {
      borderColor: deepPurple[800],
    },
  },
}));

const ProfileCard = styled(Card)(() => ({
  flex: "1 1 30%",
  maxWidth: "300px",
  background: "#35284f",
  padding: "20px 60px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "4px",
  boxShadow: "0 0 2px 0 #ccc",
  transition: "0.3s",
  color: "white",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 25px -5px #ccc",
  },
}));

function HomePage() {
  const [search, setSearch] = useState("");
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim()) {
      setLoading(true);
      setError(null);
      const token = process.env.REACT_APP_API;
      console.log(token);
      fetch(`https://api.github.com/users/${search}/repos`, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setRepoData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    }
  };

  const handleViewRepo = (repoName) => {
    navigate(`/repositories?owner=${search}&repo=${repoName}`);
  };

  return (
    <>
      <div>
        <p className="title">GitHub API</p>
      </div>
      <div className="flex">
        <FormControl
          variant="standard"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Input
            id="search-username"
            placeholder="Enter username or repository name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />
          <SearchButton
            variant="contained"
            size="large"
            className="btn"
            onClick={handleSearch}
          >
            Explore!
          </SearchButton>
        </FormControl>
      </div>

      {loading && <p className="p">Loading...</p>}
      {error && <p className="p">Error: {error.message}</p>}
      <div className="profile-container">
        {repoData.map((repo) => (
          <ProfileCard key={repo.id}>
            <img
              src={repo.owner.avatar_url}
              alt={`${repo.owner.login}'s avatar`}
              className="profile-icon"
            />
            <div className="profile-name">@{repo.owner.login}</div>
            <div className="profile-name">{repo.name}</div>

            <SearchButton
              variant="contained"
              size="large"
              onClick={() => handleViewRepo(repo.name)}
            >
              View Repository
            </SearchButton>
          </ProfileCard>
        ))}
      </div>
    </>
  );
}

export default HomePage;
