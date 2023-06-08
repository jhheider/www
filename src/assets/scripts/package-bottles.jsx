function PackageBottles() {
  const [bottles, setBottles] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const url = window.location.pathname.replace('/+', 'https://158h030vz0.execute-api.us-east-1.amazonaws.com/prod/v0/bottles/');
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setBottles(res);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return (
    <div id="bottle-preloader" className="flex one-box-down">
      <div id="bottle-status" className="flex justifit-content-center">
        <div className="mx-auto">
          <i className="icon-tea-logo-iconasset-1 grid-gray tea-icon lead mb-0"></i>
          <div id="bottle-loading-text"><p className="grid-gray">steeping available versions...</p></div>
        </div>
      </div>
    </div>
  );

  if (!bottles) return null;

  const names = [...new Set(bottles.map((b) => b.name))];

  return (
    <div>
      {names.map((name) => (
        <Bottle key={name} name={name} />
      ))}
    </div>
  );

  function Bottle({ name }) {
    const [expanded, toggleExpanded] = React.useState(false);
    const versions = [
      ...new Set(bottles.map((b) => b.version)),
    ];
    return (
      <div className="expand" onClick={() => toggleExpanded(!expanded)}>
        <div className="expand-text one-box-down">
          <h4 className="display-6">
            {versions.length} version{versions.length === 1 ? "" : "s"} bottled
          </h4>
        </div>
        <table className="one-box-down">
          <thead>
            <tr>
              <th>version</th>
              <th>darwin-aarch64</th>
              <th>darwin-x86-64</th>
              <th>linux-aarch64</th>
              <th>linux-x86-64</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((v) => {
              const available = new Set(
                bottles
                  .filter((b) => b.name === name && b.version == v)
                  .map((b) => `${b.platform}-${b.arch}`)
              );
              return (
                <tr key={v}>
                  <th>{v}</th>
                  <td>{available.has("darwin-aarch64") ? "✅" : "❌"}</td>
                  <td>{available.has("darwin-x86-64") ? "✅" : "❌"}</td>
                  <td>{available.has("linux-aarch64") ? "✅" : "❌"}</td>
                  <td>{available.has("linux-x86-64") ? "✅" : "❌"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
ReactDOM.render(React.createElement(PackageBottles), document.getElementById("packageApp"));
