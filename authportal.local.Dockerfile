# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /my-proj-authportal

# copy csproj and restore as distinct layers
COPY src/Auth/BlazorPortal/*.csproj ./
RUN find -type d -name bin -prune -exec rm -rf {} \; && find -type d -name obj -prune -exec rm -rf {} \;
RUN dotnet restore

# copy everything else and build app
COPY src/Auth/BlazorPortal/. ./
RUN dotnet publish -c release -o /my-proj-authportal/app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /my-proj-authportal/app
COPY --from=build /my-proj-authportal/app ./
ENTRYPOINT ["dotnet", "MyProj.BlazorPortal.dll"]