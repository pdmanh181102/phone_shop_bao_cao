package app.server.phone_shop.core.filter;

import java.io.IOException;
import java.util.UUID;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import app.server.phone_shop.core.auth.AuthType;
import app.server.phone_shop.core.auth.CustomCustomerDetailsService;
import app.server.phone_shop.core.auth.CustomStaffDetailsService;
import app.server.phone_shop.core.util.RequestExtractUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final CustomStaffDetailsService customStaffDetailsService;
    private final CustomCustomerDetailsService customCustomerDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        UUID accountUid = RequestExtractUtil.getAccountUid(request);
        String type = RequestExtractUtil.getType(request);

        if (type != null) {
            if (type.equals(AuthType.STAFF)) {
                if (accountUid != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = customStaffDetailsService.loadUserByUsername(accountUid.toString());
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } else if ((type.equals(AuthType.CUSTOMER))) {
                if (accountUid != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = customCustomerDetailsService.loadUserByUsername(accountUid.toString());
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}
