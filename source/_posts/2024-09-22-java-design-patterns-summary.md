---
title: java 设计模式总览
date: 2024-09-22 02:45:55
categories:
- java
- 设计模式
tags:
- java
- 设计模式
---

# 参考资料

[设计模式——设计模式中英文对照](https://blog.csdn.net/sinat_36053757/article/details/71018156)
[23种设计模式简介（中英文对照）](https://www.cnblogs.com/zmer/articles/3627480.html)
[23 种设计模式详解（全23种）](https://blog.csdn.net/A1342772/article/details/91349142)

# 23 中设计模式说明
<table>
    <thead>
        <tr>
            <th width="140">英文名</th>
            <th width="140">中文名</th>
            <th>说明</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td colspan="3" align="center"><b>创建型</b></td>
        </tr>
        <tr>
            <td>Singleton Pattern</td>
            <td>单例模式</td>
            <td>
                <p>Ensure a class has only one instance, and provide a global point of access to it.</p>
                <p>确保某一个类只有一个实例，而且自行实例化并向整个系统提供这个实例。</p>
            </td>
        </tr>
        <tr>
            <td>Factory Pattern</td>
            <td>工厂方法模式</td>
            <td>
                <p>Define an interface for creating an object,but let subclass decide which class to instantiate.Factory Method lets a class defer instantiation to subclass.</p>
                <p>定义一个用于创建对象的接口，让子类决定实例化哪一个类。工厂方法是一个类的实例化延迟到其子类。</p>
            </td>
        </tr>
        <tr>
            <td>Abstract Factory Pattern</td>
            <td>抽象工厂模式</td>
            <td>
                <p>Provide an interface for creating families of related or dependent objects without specifying their concrete classes.</p>
                <p>为创建一组相关或相互依赖的对象提供一个接口，而且无需指定它们的具体类。</p>
            </td>
        </tr>
        <tr>
            <td>Prototype Pattern</td>
            <td>原型模式</td>
            <td>
                <p>Specify the kinds of objects to create using a prototypical instance, and create new objects by copying this prototype.</p>
                <p>用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。</p>
            </td>
        </tr>
        <tr>
            <td>Builder Pattern</td>
            <td>建造者模式</td>
            <td>
                <p>Separate the construction of a complex object form its representation so that the same construction process can create different representations.</p>
                <p>将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。</p>
            </td>
        </tr>
        <tr>
            <td colspan="3" align="center"><b>结构型</b></td>
        </tr>
        <tr>
            <td>Adapter Pattern</td>
            <td>适配器模式</td>
            <td>
                <p>Convert the inface of a class into another interface clients expect.Adapter lets classes work together that couldn't otherwise because of incompatible interface.</p>
                <p>将一个类的接口变换成客户端所期待的另一种接口，从而使原本因接口不匹配而无法在一起工作的两个类能够在一起工作。</p>
                <p>“系统的数据和行为都正确，单接口不符时，我们应该考虑使用适配器，目的是是控制范围之外的一个原有对象与某个接口匹配。适配器模式主要用于希望复用一些现存的类，但是接口又与复用环境不一致的情况。”（《大话设计模式》）>
            </td>
        </tr>
        <tr>
            <td>Decorator Pattern</td>
            <td>装饰模式</td>
            <td>
                <p>Attach additional responsibilities to an object dynamically keeping the same interface.Decorators provide a flexible alternative to subclassing for extending functionality.</p>
                <p>动态地给一个对象添加一些额外的职责。就增加功能来说，装饰模式相比生成子类更为灵活。</p>
            </td>
        </tr>
        <tr>
            <td>Proxy pattern</td>
            <td>代理模式</td>
            <td>
                <p>Provide a surrogate (代理) or placeholder for another object to control access to it.</p>
                <p>为其他对象提供一种代理以控制对这个对象的访问。</p>
            </td>
        </tr>
        <tr>
            <td>Facade Pattern</td>
            <td>门面模式</td>
            <td>
                <p>Provide a unified interface to a set of interface in a subsystem.Facede defines a higher-level interface that makes the subsystem easier to use.</p>
                <p>要求一个子系统的外部与其内部的通信必须通过一个统一的对象进行。门面模式提供了一个高层次的接口，使得子系统更容易使用。</p>
            </td>
        </tr>
        <tr>
            <td>Bridge Pattern</td>
            <td>桥梁模式</td>
            <td>
                <p>Decouple an abstraction from its implementation so that the two can vary independently.</p>
                <p>将抽象和实现解耦，使得两者可以独立的变化。</p>
            </td>
        </tr>
        <tr>
            <td>Composite Pattern</td>
            <td>组合模式</td>
            <td>
                <p>Compose objects into tree structure to represent part-whole hierarchies.Composite lets clients treat individual objects and compositions of objects uniformly.</p>
                <p>将对象组合成树形结构以表示“部分-整体”的层次结构，使得用户对单个对象和组合对象的使用具有一致性。</p>
            </td>
        </tr>
        <tr>
            <td>Flyweight Pattern</td>
            <td>享元模式</td>
            <td>
                <p>Use sharing to support large numbers of fine-grained objects efficiently.</p>
                <p>使用共享对象可有效地支持大量的细粒度对象。</p>
            </td>
        </tr>
        <tr>
            <td colspan="3" align="center"><b>行为型</b></td>
        </tr>
        <tr>
            <td>Template Method Pattern</td>
            <td>模板方法模式</td>
            <td>
                <p>Define the skeleton of an algorithm in an operation,deferring some steps to subclasses.Template Method lets subclass redefine certain steps of an algorithm without changing the algorithm's structure. </p>
                <p>定义一个操作中的算法框架，而将一些步骤延迟到子类中。使得子类可以不改变一个算法的结构即可以重定义该算法的某些特定步骤。</p>
            </td>
        </tr>
        <tr>
            <td>Mediator Pattern</td>
            <td>中介者模式</td>
            <td>
                <p>Define an object that encapsulates how a set of objects interact.Mediator promotes loose couping by keeping objects from referring to each other explicitly, and it lets you vary their interaction independently.</p>
                <p>用一个中介对象封装一系列的对象交互，中介者使各对象不需要显示的相互作用，从而使其耦合松散，而且可以独立的改变它们之间的交互。</p>
            </td>
        </tr>
        <tr>
            <td>Command Pattern</td>
            <td>命令模式</td>
            <td>
                <p>Encapsulate a request as an object,thereby letting you parameterize clients with different requests,queue or log requests, and support undoable operations.</p>
                <p>将一个请求封装成一个对象，从而让你使用不同的请求把客户端参数化，对请求排队或者记录请求日志，可以提供命令的撤销和恢复功能。</p>
            </td>
        </tr>
        <tr>
            <td>Chain of Responsibility Pattern</td>
            <td>责任链模式</td>
            <td>
                <p>Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle the request.Chain the receiving objects and pass the request along the chain until an object handles it.</p>
                <p>使多个对象有机会处理请求，从而避免了请求的发送者和接收者之间的耦合关系 。将这些对象连成一个链，并沿着这条链传递请求，知道有对象处理它为止。</p>
            </td>
        </tr>
        <tr>
            <td>Strategy Pattern</td>
            <td>策略模式</td>
            <td>
                <p>Define a family of algorithms, encapsulate each one, and make them interchangeable.</p>
                <p>定义一组算法，将每个算法都封装起来，并且使他们之间可以互换。</p>
            </td>
        </tr>
        <tr>
            <td>Iterator Pattern</td>
            <td>迭代器模式</td>
            <td>
                <p>Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.</p>
                <p>它提供一种方法访问一个容器对象中各个元素，而又不需要暴露该对象的内部细节。</p>
            </td>
        </tr>
        <tr>
            <td>Observer Pattern</td>
            <td>观察者模式</td>
            <td>
                <p>Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.</p>
                <p>定义对象间一种一对多的依赖关系，使得每当一个对象改变状态，则所有依赖于它的对象都会得到通知并被自动更新。</p>
            </td>
        </tr>
        <tr>
            <td>Memento Pattern</td>
            <td>备忘录模式</td>
            <td>
                <p>Without violating encapsulation， capture and externalize an object's internal state so that the object can be restored to this state later.</p>
                <p>在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样以后就可将该对象恢复到原来保存的状态。</p>
            </td>
        </tr>
        <tr>
            <td>Visitor Pattern</td>
            <td>访问者模式</td>
            <td>
                <p>Represent an operation to be performed on the elements of an object structure.Visitor lets you define a new operation without changing the classes of the elements on which it operates.</p>
                <p>封装一些作用于某种数据结构中的各种元素，它可以在不改变数据结构的前提下定义作用于这些元素的新的操作。</p>
            </td>
        </tr>
        <tr>
            <td>State Pattern</td>
            <td>状态模式</td>
            <td>
                <p>Allow an object to alter its behavior when its internal state changes.The object will appear to change its class.</p>
                <p>当一个对象在状态改变时允许其改变行为，这个对象看起来像改变了其类。</p>
            </td>
        </tr>
        <tr>
            <td>Interpreter Pattern</td>
            <td>解释器模式</td>
            <td>
                <p>Given a language, define a representation for its grammar along with an interpreter that uses the representation to interpret sentences int the language.</p>
                <p>给定一门语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。</p>
            </td>
        </tr>
    </tbody>
</table>