---
title: avalonia hello world
date: 2024-08-12 21:09:27
categories:
- 桌面端开发
- dotnet
- avalonia
tags:
- 桌面端开发
- dotnet
- avalonia
---


avalonia hello world

<!-- more -->

# 参考资料

[https://github.com/dorisoy/Prism.Avalonia](https://github.com/dorisoy/Prism.Avalonia)
[https://github.com/SuessLabs/Prism.Avalonia.Templates/tree/master](https://github.com/SuessLabs/Prism.Avalonia.Templates/tree/master)

[WPF-Prism8.0核心教程(公益)](https://www.bilibili.com/video/BV1Ei4y1F7du)

# 新建 avalonia 项目

```
md AvaloniaStudy
cd AvaloniaStudy
dotnet new sln
dotnet new avalonia.app -o AvaloniaHello
dotnet sln add AvaloniaHello\AvaloniaHello.csproj
```

# 添加 prism 依赖

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <BuiltInComInteropSupport>true</BuiltInComInteropSupport>
    <ApplicationManifest>app.manifest</ApplicationManifest>
    <AvaloniaUseCompiledBindingsByDefault>true</AvaloniaUseCompiledBindingsByDefault>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Avalonia" Version="11.1.0" />
    <PackageReference Include="Avalonia.Desktop" Version="11.1.0" />
    <PackageReference Include="Avalonia.Themes.Fluent" Version="11.1.0" />
    <PackageReference Include="Avalonia.Fonts.Inter" Version="11.1.0" />
    <!--Condition below is needed to remove Avalonia.Diagnostics package from build output in Release configuration.-->
    <PackageReference Condition="'$(Configuration)' == 'Debug'" Include="Avalonia.Diagnostics" Version="11.1.0" />

    <!-- prism 依赖,只能使用 DryIoc , avalonia 不支持 unity ioc -->
    <PackageReference Include="Prism.DryIoc.Avalonia" Version="8.1.97.11073" />
  </ItemGroup>
</Project>
```

![](/images/2024-08-12_avalonia_hello_world/001.png)

# 修改项目文件

## App.axaml.cs
```csharp
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using AvaloniaHello.ViewModels;
using AvaloniaHello.Views;
using Prism.DryIoc;
using Prism.Ioc;

namespace AvaloniaHello;

public partial class App : PrismApplication
{
    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
        base.Initialize(); // 该行必须存在
    }

    public override void OnFrameworkInitializationCompleted()
    {
        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            desktop.MainWindow = new MainWindow
            {
                DataContext = new MainWindowViewModel() // 指定 datacontext
            };
        }

        base.OnFrameworkInitializationCompleted();
    }

    protected override AvaloniaObject CreateShell()
    {
        return Container.Resolve<MainWindow>(); // 启动窗口
    }

    protected override void RegisterTypes(IContainerRegistry containerRegistry)
    {
    }
}
```

## MainWindow

### 新建
新建一个 `MainWindow` , 注意: 要先新建目录,并且将 `namespace` 修改正确

![](/images/2024-08-12_avalonia_hello_world/002.png)

### axaml
```xml
<Window xmlns="https://github.com/avaloniaui"
        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
        xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
        xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
        mc:Ignorable="d" d:DesignWidth="800" d:DesignHeight="450"
		xmlns:prism="http://prismlibrary.com/" 注意这里
		xmlns:vm="using:AvaloniaHello.ViewModels" 注意这里
		x:DataType="vm:MainWindowViewModel" 注意这里
        x:Class="AvaloniaHello.Views.MainWindow"
		prism:ViewModelLocator.AutoWireViewModel="True" 注意这里
        Title="MainWindow">
	<TextBlock Text="{Binding Greeting}"
			   HorizontalAlignment="Center"
			   VerticalAlignment="Center" />
</Window>
```

## MainWindowViewModel
```csharp
using Prism.Mvvm;

namespace AvaloniaHello.ViewModels
{
    internal class MainWindowViewModel : BindableBase
    {
        public string Greeting => "Welcome to Prism.Avalonia!";
    }
}
```

# 运行结果
![](/images/2024-08-12_avalonia_hello_world/003.png)
