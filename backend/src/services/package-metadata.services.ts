export interface PackageMetadata {
  name: string | null;
  version: string | null;

  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  optionalDependencies: Record<string, string>;

  scripts: Record<string, string>;

  engines: Record<string, string>;

  packageManager: string | null;
}

export function extractPackageMetadata(
  content: string,
): PackageMetadata {
  const packageJson = JSON.parse(content);

  return {
    name: packageJson.name ?? null,
    version: packageJson.version ?? null,

    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
    peerDependencies: packageJson.peerDependencies ?? {},
    optionalDependencies: packageJson.optionalDependencies ?? {},

    scripts: packageJson.scripts ?? {},

    engines: packageJson.engines ?? {},

    packageManager: packageJson.packageManager ?? null,
  };
}