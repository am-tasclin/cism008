package org.algoritmed.cism008.test02reactive;

import java.util.List;
import java.util.function.Function;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

//https://www.javaguides.net/2023/04/project-reactor-mono-and-flux-examples.html
public class Test03 {

    public Mono<String> fruitsMonoZipWith() {
        var fruits = Mono.just("Mango");
        var veggies = Mono.just("Tomato");

        return fruits.zipWith(veggies,
                (first, second) -> first + "-" + second)
                // .log()
                ;
    }

    public Flux<String> fruitsFlux(int numer) {

        Function<Flux<String>, Flux<String>> filterData = data -> data.filter(s -> s.length() > numer).log();

        return Flux.fromIterable(List.of("Mango", "Orange", "Banana"))
                .transform(filterData)
                // .filter(s -> s.length() > numer)
                .map(String::toUpperCase);// .log();
    }

    public static void main(String[] args) {
        System.out.println(123);
        System.out.println(1 % 3);
        System.out.println(2 % 3);
        System.out.println(3 % 3);
        System.out.println(4 % 3);

        Test03 fluxAndMonoServices = new Test03();

        fluxAndMonoServices.fruitsMonoZipWith()
                .subscribe(s -> System.out.println("Mono -> s = " + s));

        fluxAndMonoServices.fruitsFlux(5)
                .subscribe(s -> System.out.println("s = " + s));
    }
}
