# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /my-proj-auth

# copy csproj and restore as distinct layers
COPY src/Auth/*.sln .
COPY src/Auth/WebApi/*.csproj ./WebApi/
RUN find -type d -name bin -prune -exec rm -rf {} \; && find -type d -name obj -prune -exec rm -rf {} \;
RUN dotnet restore

# copy everything else and build app
COPY src/Auth/WebApi/. ./WebApi/
WORKDIR /my-proj-auth/WebApi
RUN dotnet publish -c release -o /my-proj-auth/app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /my-proj-auth/app
COPY --from=build /my-proj-auth/app ./
ENTRYPOINT ["dotnet", "MyProj.WebApi.dll"]