import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { Content, PageTitle } from "../../Components/Page";
import styled from "styled-components";
import { ToastContext, AuthContext } from "../../contexts";

import { errorToaster } from "../../api";
import { Markdown } from "../../Components/Markdown";
import { Row, Col } from "react-awesome-styled-grid";
import { Card } from "../../Components/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
//  faAnchor,
//  faBinoculars,
//  faFistRaised,
//  faGraduationCap,
//  faHeart,
//  faIdBadge,
  faBook,
//  faInfo,
//  faLevelUpAlt,
//  faSignInAlt,
//  faUserGraduate,
//  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const guideData = {};
function importAll(r) {
  r.keys().forEach((key) => (guideData[key] = r(key)));
}
importAll(require.context("./guides", true, /\.(md|jpg|png)$/));

const GuideContent = styled(Content)`
  max-width: 800px;
`;

export function Guide() {
  const toastContext = React.useContext(ToastContext);
  const { guideName } = useParams();
  const [loadedData, setLoadedData] = React.useState(null);
  const guidePath = `./${guideName}`;
  const filename = `${guidePath}/guide.md`;

  React.useEffect(() => {
    setLoadedData(null);
    if (!(filename in guideData)) return;

    errorToaster(
      toastContext,
      fetch(guideData[filename].default)
        .then((response) => response.text())
        .then(setLoadedData)
    );
  }, [toastContext, filename]);

  const resolveImage = (name) => {
    const originalName = `${guidePath}/${name}`;
    if (originalName in guideData) {
      return guideData[originalName].default;
    }
    return name;
  };

  if (!guideData[filename]) {
    return (
      <>
        <strong>Not found!</strong> The guide could not be loaded.
      </>
    );
  }

  if (!loadedData) {
    return (
      <>
        <em>Loading...</em>
      </>
    );
  }

  return (
    <GuideContent style={{ maxWidth: "800px" }}>
      <Markdown transformImageUri={resolveImage} transformLinkUri={null}>
        {loadedData}
      </Markdown>
    </GuideContent>
  );
}

function GuideCard({ icon, slug, name, children }) {
  return (
    <Col xs={4} sm={4} lg={3}>
      <NavLink style={{ textDecoration: "inherit", color: "inherit" }} exact to={`${slug}`}>
        <Card
          title={
            <>
              <FontAwesomeIcon fixedWidth icon={icon} /> {name}
            </>
          }
        >
          <p>{children}</p>
        </Card>
      </NavLink>
    </Col>
  );
}

export function GuideIndex() {
  const authContext = React.useContext(AuthContext);
  return (
    <>
      <PageTitle>Guides</PageTitle>
      <Row>
        {authContext && (
          <GuideCard slug="/skills/plans" name="Skill Plans" icon={faBook}>
            Skill plans for anyone with doubts what to skill first.
          </GuideCard>
        )}
      </Row>
    </>
  );
}
