package com.vutran0943.order_service.utils;

import com.vutran0943.order_service.dto.response.ApiResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;


@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RestConsumer {
    WebClient.Builder webClientBuilder;

    public <T> T getWithApiResponse(String relativeUrl, ParameterizedTypeReference<ApiResponse<T>> typeReference, MultiValueMap<String, String> params) {
        return webClientBuilder.build()
                .get()
                .uri(relativeUrl, uriBuilder ->
                    uriBuilder
                        .queryParams(params)
                        .build())
                .retrieve()
                .bodyToMono(typeReference)
                .block()
                .getData();
    }
}
